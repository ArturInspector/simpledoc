/**
 * Document Store - Управление документом
 */

import { writable, derived, get } from 'svelte/store';
import type { 
  Document, 
  Page,
  DocumentMetadata,
  DocumentHistory,
  HistoryEntry,
  AutoSaveState 
} from '$lib/types/document';
import type { Block } from '$lib/types/blocks';
import { blocks } from './blocks';
import { canvasStore } from './canvas';

// ============================================================================
// Начальное состояние
// ============================================================================

const initialDocument: Document | null = null;

const initialAutoSave: AutoSaveState = {
  lastSaved: null,
  isSaving: false,
  hasUnsavedChanges: false,
  error: null
};

// ============================================================================
// Stores
// ============================================================================

export const currentDocument = writable<Document | null>(initialDocument);
export const autoSaveState = writable<AutoSaveState>(initialAutoSave);

// ============================================================================
// Document Actions
// ============================================================================

export const documentActions = {
  /**
   * Создать новый документ
   */
  create: (title: string = 'Untitled Document') => {
    const now = new Date();
    const canvasState = get(canvasStore);
    
    const newPage: Page = {
      id: crypto.randomUUID(),
      order: 0,
      config: canvasState.currentPage,
      blocks: [],
      thumbnail: undefined
    };
    
    const newDocument: Document = {
      id: crypto.randomUUID(),
      title,
      description: '',
      pages: [newPage],
      currentPageIndex: 0,
      metadata: {
        createdAt: now,
        updatedAt: now,
        author: '',
        tags: [],
        category: undefined,
        stats: {
          totalBlocks: 0,
          totalPages: 1,
          wordCount: 0,
          imageCount: 0
        }
      },
      exportSettings: {
        pdf: {
          quality: 'high',
          embedFonts: true,
          compressImages: true,
          colorSpace: 'RGB',
          metadata: {}
        },
        docx: {
          compatibility: 'docx',
          embedImages: true,
          preserveLayout: true
        },
        image: {
          format: 'png',
          quality: 90,
          dpi: 150,
          scale: 1
        }
      },
      version: 1,
      history: {
        currentIndex: -1,
        entries: [],
        maxEntries: 50
      }
    };
    
    currentDocument.set(newDocument);
    blocks.set([]);
    
    autoSaveState.update(state => ({
      ...state,
      hasUnsavedChanges: true
    }));
    
    return newDocument.id;
  },
  
  /**
   * Загрузить документ
   */
  load: (document: Document) => {
    currentDocument.set(document);
    
    // Загружаем блоки текущей страницы
    const currentPage = document.pages[document.currentPageIndex];
    if (currentPage) {
      blocks.set(currentPage.blocks);
      
      // Обновляем canvas конфигурацию
      canvasStore.setPageSize(currentPage.config.size.name);
      canvasStore.setPageOrientation(currentPage.config.orientation);
      canvasStore.setPageMargins(currentPage.config.margins);
    }
    
    autoSaveState.update(state => ({
      ...state,
      hasUnsavedChanges: false,
      lastSaved: document.metadata.updatedAt
    }));
  },
  
  /**
   * Сохранить документ (синхронизация блоков с текущей страницей)
   */
  save: () => {
    const doc = get(currentDocument);
    if (!doc) return;
    
    const currentBlocks = get(blocks);
    const now = new Date();
    
    // Обновляем блоки на текущей странице
    const updatedPages = doc.pages.map((page, index) => {
      if (index === doc.currentPageIndex) {
        return {
          ...page,
          blocks: currentBlocks
        };
      }
      return page;
    });
    
    // Обновляем статистику
    const totalBlocks = updatedPages.reduce((sum, page) => sum + page.blocks.length, 0);
    const imageCount = updatedPages.reduce(
      (sum, page) => sum + page.blocks.filter(b => b.type === 'image').length,
      0
    );
    
    currentDocument.update(doc => doc ? ({
      ...doc,
      pages: updatedPages,
      metadata: {
        ...doc.metadata,
        updatedAt: now,
        stats: {
          ...doc.metadata.stats,
          totalBlocks,
          imageCount
        }
      },
      version: doc.version + 1
    }) : null);
    
    autoSaveState.update(state => ({
      ...state,
      hasUnsavedChanges: false,
      lastSaved: now
    }));
  },
  
  /**
   * Обновить метаданные
   */
  updateMetadata: (updates: Partial<DocumentMetadata>) => {
    currentDocument.update(doc => doc ? ({
      ...doc,
      metadata: {
        ...doc.metadata,
        ...updates,
        updatedAt: new Date()
      }
    }) : null);
    
    documentActions.markAsChanged();
  },
  
  /**
   * Обновить заголовок
   */
  updateTitle: (title: string) => {
    currentDocument.update(doc => doc ? ({
      ...doc,
      title,
      metadata: {
        ...doc.metadata,
        updatedAt: new Date()
      }
    }) : null);
    
    documentActions.markAsChanged();
  },
  
  /**
   * Отметить документ как измененный
   */
  markAsChanged: () => {
    autoSaveState.update(state => ({
      ...state,
      hasUnsavedChanges: true
    }));
  },
  
  /**
   * Закрыть документ
   */
  close: () => {
    currentDocument.set(null);
    blocks.set([]);
    autoSaveState.set(initialAutoSave);
  }
};

// ============================================================================
// Page Actions
// ============================================================================

export const pageActions = {
  /**
   * Добавить страницу
   */
  add: () => {
    currentDocument.update(doc => {
      if (!doc) return null;
      
      const newPage: Page = {
        id: crypto.randomUUID(),
        order: doc.pages.length,
        config: doc.pages[0].config, // Копируем настройки первой страницы
        blocks: [],
        thumbnail: undefined
      };
      
      return {
        ...doc,
        pages: [...doc.pages, newPage],
        metadata: {
          ...doc.metadata,
          updatedAt: new Date(),
          stats: {
            ...doc.metadata.stats,
            totalPages: doc.pages.length + 1
          }
        }
      };
    });
    
    documentActions.markAsChanged();
  },
  
  /**
   * Удалить страницу
   */
  remove: (pageId: string) => {
    currentDocument.update(doc => {
      if (!doc || doc.pages.length <= 1) return doc; // Минимум одна страница
      
      const newPages = doc.pages.filter(p => p.id !== pageId);
      
      // Пересчитываем порядок
      newPages.forEach((page, index) => {
        page.order = index;
      });
      
      // Корректируем текущую страницу если нужно
      let newCurrentIndex = doc.currentPageIndex;
      if (newCurrentIndex >= newPages.length) {
        newCurrentIndex = newPages.length - 1;
      }
      
      return {
        ...doc,
        pages: newPages,
        currentPageIndex: newCurrentIndex,
        metadata: {
          ...doc.metadata,
          updatedAt: new Date(),
          stats: {
            ...doc.metadata.stats,
            totalPages: newPages.length
          }
        }
      };
    });
    
    documentActions.markAsChanged();
  },
  
  /**
   * Переключить на страницу
   */
  switchTo: (pageIndex: number) => {
    const doc = get(currentDocument);
    if (!doc || pageIndex < 0 || pageIndex >= doc.pages.length) return;
    
    // Сохраняем блоки текущей страницы
    documentActions.save();
    
    // Загружаем блоки новой страницы
    const newPage = doc.pages[pageIndex];
    blocks.set(newPage.blocks);
    
    currentDocument.update(doc => doc ? ({
      ...doc,
      currentPageIndex: pageIndex
    }) : null);
  },
  
  /**
   * Дублировать страницу
   */
  duplicate: (pageId: string) => {
    currentDocument.update(doc => {
      if (!doc) return null;
      
      const page = doc.pages.find(p => p.id === pageId);
      if (!page) return doc;
      
      const newPage: Page = {
        ...page,
        id: crypto.randomUUID(),
        order: doc.pages.length,
        blocks: page.blocks.map(block => ({
          ...block,
          id: crypto.randomUUID()
        }))
      };
      
      return {
        ...doc,
        pages: [...doc.pages, newPage],
        metadata: {
          ...doc.metadata,
          updatedAt: new Date(),
          stats: {
            ...doc.metadata.stats,
            totalPages: doc.pages.length + 1
          }
        }
      };
    });
    
    documentActions.markAsChanged();
  }
};

// ============================================================================
// Derived Stores
// ============================================================================

/**
 * Текущая страница
 */
export const currentPage = derived(
  currentDocument,
  ($doc) => {
    if (!$doc || $doc.currentPageIndex < 0 || $doc.currentPageIndex >= $doc.pages.length) {
      return null;
    }
    return $doc.pages[$doc.currentPageIndex];
  }
);

/**
 * Есть ли открытый документ
 */
export const hasDocument = derived(
  currentDocument,
  ($doc) => $doc !== null
);

/**
 * Можно ли сохранить
 */
export const canSave = derived(
  [currentDocument, autoSaveState],
  ([$doc, $autoSave]) => $doc !== null && $autoSave.hasUnsavedChanges && !$autoSave.isSaving
);

/**
 * Заголовок документа (для отображения)
 */
export const documentTitle = derived(
  currentDocument,
  ($doc) => $doc?.title || 'No Document'
);

