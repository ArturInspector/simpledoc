/**
 * Document Types - Типы документов и страниц
 */

import type { Block } from './blocks';
import type { PageConfig } from './canvas';

// ============================================================================
// Документ
// ============================================================================

export interface Document {
  id: string;
  title: string;
  description?: string;
  
  // Страницы документа
  pages: Page[];
  currentPageIndex: number;
  
  // Метаданные
  metadata: DocumentMetadata;
  
  // Настройки экспорта
  exportSettings: ExportSettings;
  
  // История изменений
  version: number;
  history: DocumentHistory;
}

export interface Page {
  id: string;
  order: number;          // порядковый номер страницы
  config: PageConfig;     // конфигурация страницы (размер, поля)
  blocks: Block[];        // блоки на странице
  thumbnail?: string;     // base64 превью страницы
}

// ============================================================================
// Метаданные документа
// ============================================================================

export interface DocumentMetadata {
  createdAt: Date;
  updatedAt: Date;
  author: string;
  tags: string[];
  category?: string;
  
  // Статистика
  stats: {
    totalBlocks: number;
    totalPages: number;
    wordCount: number;
    imageCount: number;
  };
}

// ============================================================================
// История документа
// ============================================================================

export interface DocumentHistory {
  currentIndex: number;
  entries: HistoryEntry[];
  maxEntries: number;      // максимум записей (обычно 50-100)
}

export interface HistoryEntry {
  id: string;
  timestamp: Date;
  action: HistoryAction;
  description: string;
  snapshot: DocumentSnapshot; // снимок состояния для undo
}

export type HistoryAction =
  | 'create_document'
  | 'add_page'
  | 'delete_page'
  | 'reorder_pages'
  | 'add_block'
  | 'delete_block'
  | 'update_block'
  | 'move_block'
  | 'resize_block'
  | 'group_blocks'
  | 'ungroup_blocks';

export interface DocumentSnapshot {
  pageIndex: number;
  blocks: Block[];         // состояние блоков до изменения
}

// ============================================================================
// Настройки экспорта
// ============================================================================

export interface ExportSettings {
  pdf: PDFExportSettings;
  docx: DOCXExportSettings;
  image: ImageExportSettings;
}

export interface PDFExportSettings {
  quality: 'low' | 'medium' | 'high' | 'print';
  embedFonts: boolean;
  compressImages: boolean;
  colorSpace: 'RGB' | 'CMYK';
  metadata: {
    title?: string;
    author?: string;
    subject?: string;
    keywords?: string[];
  };
}

export interface DOCXExportSettings {
  compatibility: 'docx' | 'doc';
  embedImages: boolean;
  preserveLayout: boolean;
}

export interface ImageExportSettings {
  format: 'png' | 'jpg' | 'webp';
  quality: number;         // 0-100
  dpi: number;             // обычно 72, 150, 300
  scale: number;           // масштаб (1 = 100%)
}

// ============================================================================
// Шаблоны документов
// ============================================================================

export interface DocumentTemplate {
  id: string;
  name: string;
  description: string;
  category: TemplateCategory;
  thumbnail: string;       // preview изображение
  
  // Базовая структура шаблона
  pages: PageTemplate[];
  
  // Переменные для подстановки
  variables: TemplateVariable[];
  
  metadata: {
    author: string;
    createdAt: Date;
    downloads: number;
    rating: number;
    tags: string[];
  };
}

export type TemplateCategory = 
  | 'business' 
  | 'marketing' 
  | 'invoice' 
  | 'contract' 
  | 'presentation'
  | 'report'
  | 'other';

export interface PageTemplate {
  config: PageConfig;
  blocks: BlockTemplate[];
}

export interface BlockTemplate {
  type: string;
  position: { x: number; y: number };
  size: { width: number; height: number };
  content: any;
  styles: any;
  isVariable?: boolean;    // содержит переменную
  variableKey?: string;    // ключ переменной для подстановки
}

export interface TemplateVariable {
  key: string;             // уникальный ключ (например: "company_name")
  label: string;           // отображаемое название
  type: VariableType;
  required: boolean;
  defaultValue?: any;
  placeholder?: string;
  validation?: VariableValidation;
}

export type VariableType = 
  | 'text' 
  | 'number' 
  | 'date' 
  | 'email'
  | 'phone'
  | 'url'
  | 'textarea'
  | 'select'
  | 'image';

export interface VariableValidation {
  min?: number;            // минимальное значение/длина
  max?: number;            // максимальное значение/длина
  pattern?: string;        // regex паттерн
  options?: string[];      // опции для select
}

// ============================================================================
// Автосохранение
// ============================================================================

export interface AutoSaveConfig {
  enabled: boolean;
  intervalSeconds: number; // интервал в секундах
  maxBackups: number;      // максимум бэкапов
}

export interface AutoSaveState {
  lastSaved: Date | null;
  isSaving: boolean;
  hasUnsavedChanges: boolean;
  error: string | null;
}

