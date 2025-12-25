/**
 * Blocks Store - Управление блоками на странице
 */

import { writable, derived, get } from 'svelte/store';
import type { 
  Block, 
  BlockType,
  Position,
  Size,
  BlockSelection,
  BlockDragState,
  BlockResizeState,
  ResizeHandle
} from '$lib/types/blocks';
import { canvasStore, snapPositionToGrid } from './canvas';

// ============================================================================
// Начальное состояние
// ============================================================================

const initialBlocks: Block[] = [];

const initialSelection: BlockSelection = {
  blockIds: [],
  mode: 'single',
  anchorPoint: undefined
};

const initialDragState: BlockDragState = {
  isDragging: false,
  blockId: null,
  startPosition: null,
  currentPosition: null,
  offset: null
};

const initialResizeState: BlockResizeState = {
  isResizing: false,
  blockId: null,
  handle: null,
  startSize: null,
  startPosition: null,
  aspectRatio: undefined
};

// ============================================================================
// Stores
// ============================================================================

export const blocks = writable<Block[]>(initialBlocks);
export const selection = writable<BlockSelection>(initialSelection);
export const dragState = writable<BlockDragState>(initialDragState);
export const resizeState = writable<BlockResizeState>(initialResizeState);

// ============================================================================
// Block CRUD Operations
// ============================================================================

export const blocksActions = {
  /**
   * Добавить блок
   */
  add: (block: Block) => {
    blocks.update(items => {
      // Проверяем уникальность ID
      if (items.some(b => b.id === block.id)) {
        console.error('Block with this ID already exists');
        return items;
      }
      
      return [...items, block];
    });
  },
  
  /**
   * Удалить блок
   */
  remove: (blockId: string) => {
    blocks.update(items => items.filter(b => b.id !== blockId));
    
    // Убираем из выделения
    selection.update(sel => ({
      ...sel,
      blockIds: sel.blockIds.filter(id => id !== blockId)
    }));
  },
  
  /**
   * Удалить несколько блоков
   */
  removeMany: (blockIds: string[]) => {
    blocks.update(items => items.filter(b => !blockIds.includes(b.id)));
    
    // Очищаем выделение
    selectionActions.clear();
  },
  
  /**
   * Обновить блок
   */
  update: (blockId: string, updates: Partial<Block>) => {
    blocks.update(items => 
      items.map(block => 
        block.id === blockId 
          ? { 
              ...block, 
              ...updates,
              metadata: {
                ...block.metadata,
                updatedAt: new Date(),
                version: block.metadata.version + 1
              }
            }
          : block
      )
    );
  },
  
  /**
   * Переместить блок
   */
  move: (blockId: string, position: Position) => {
    const canvasState = get(canvasStore);
    const snappedPosition = snapPositionToGrid(position, canvasState);
    
    blocksActions.update(blockId, { position: snappedPosition });
  },
  
  /**
   * Изменить размер блока
   */
  resize: (blockId: string, size: Size, position?: Position) => {
    const updates: Partial<Block> = { size };
    
    if (position) {
      const canvasState = get(canvasStore);
      updates.position = snapPositionToGrid(position, canvasState);
    }
    
    blocksActions.update(blockId, updates);
  },
  
  /**
   * Изменить z-index блока
   */
  setZIndex: (blockId: string, zIndex: number) => {
    blocksActions.update(blockId, { zIndex });
  },
  
  /**
   * Переместить блок вверх по z-index
   */
  bringForward: (blockId: string) => {
    const allBlocks = get(blocks);
    const block = allBlocks.find(b => b.id === blockId);
    if (!block) return;
    
    const maxZIndex = Math.max(...allBlocks.map(b => b.zIndex));
    if (block.zIndex < maxZIndex) {
      blocksActions.setZIndex(blockId, block.zIndex + 1);
    }
  },
  
  /**
   * Переместить блок вниз по z-index
   */
  sendBackward: (blockId: string) => {
    const allBlocks = get(blocks);
    const block = allBlocks.find(b => b.id === blockId);
    if (!block) return;
    
    const minZIndex = Math.min(...allBlocks.map(b => b.zIndex));
    if (block.zIndex > minZIndex) {
      blocksActions.setZIndex(blockId, block.zIndex - 1);
    }
  },
  
  /**
   * Переместить в самый верх
   */
  bringToFront: (blockId: string) => {
    const allBlocks = get(blocks);
    const maxZIndex = Math.max(...allBlocks.map(b => b.zIndex));
    blocksActions.setZIndex(blockId, maxZIndex + 1);
  },
  
  /**
   * Переместить в самый низ
   */
  sendToBack: (blockId: string) => {
    const allBlocks = get(blocks);
    const minZIndex = Math.min(...allBlocks.map(b => b.zIndex));
    blocksActions.setZIndex(blockId, minZIndex - 1);
  },
  
  /**
   * Заблокировать/разблокировать блок
   */
  toggleLock: (blockId: string) => {
    const allBlocks = get(blocks);
    const block = allBlocks.find(b => b.id === blockId);
    if (!block) return;
    
    blocksActions.update(blockId, { locked: !block.locked });
  },
  
  /**
   * Показать/скрыть блок
   */
  toggleVisibility: (blockId: string) => {
    const allBlocks = get(blocks);
    const block = allBlocks.find(b => b.id === blockId);
    if (!block) return;
    
    blocksActions.update(blockId, { visible: !block.visible });
  },
  
  /**
   * Дублировать блок
   */
  duplicate: (blockId: string) => {
    const allBlocks = get(blocks);
    const block = allBlocks.find(b => b.id === blockId);
    if (!block) return;
    
    const newBlock: Block = {
      ...block,
      id: crypto.randomUUID(),
      position: {
        x: block.position.x + 20,
        y: block.position.y + 20
      },
      metadata: {
        createdAt: new Date(),
        updatedAt: new Date(),
        version: 1
      }
    };
    
    blocksActions.add(newBlock);
    return newBlock.id;
  },
  
  /**
   * Очистить все блоки
   */
  clear: () => {
    blocks.set([]);
    selectionActions.clear();
  }
};

// ============================================================================
// Selection Operations
// ============================================================================

export const selectionActions = {
  /**
   * Выбрать блок (с очисткой предыдущего выделения)
   */
  select: (blockId: string) => {
    selection.set({
      blockIds: [blockId],
      mode: 'single',
      anchorPoint: undefined
    });
  },
  
  /**
   * Добавить блок к выделению
   */
  add: (blockId: string) => {
    selection.update(sel => {
      if (sel.blockIds.includes(blockId)) return sel;
      
      return {
        blockIds: [...sel.blockIds, blockId],
        mode: sel.blockIds.length > 0 ? 'multiple' : 'single',
        anchorPoint: sel.anchorPoint
      };
    });
  },
  
  /**
   * Убрать блок из выделения
   */
  remove: (blockId: string) => {
    selection.update(sel => {
      const newBlockIds = sel.blockIds.filter(id => id !== blockId);
      
      return {
        blockIds: newBlockIds,
        mode: newBlockIds.length > 1 ? 'multiple' : 'single',
        anchorPoint: sel.anchorPoint
      };
    });
  },
  
  /**
   * Выбрать несколько блоков
   */
  selectMany: (blockIds: string[]) => {
    selection.set({
      blockIds,
      mode: blockIds.length > 1 ? 'multiple' : 'single',
      anchorPoint: undefined
    });
  },
  
  /**
   * Выбрать все блоки
   */
  selectAll: () => {
    const allBlocks = get(blocks);
    const allIds = allBlocks.filter(b => !b.locked).map(b => b.id);
    
    selection.set({
      blockIds: allIds,
      mode: 'multiple',
      anchorPoint: undefined
    });
  },
  
  /**
   * Очистить выделение
   */
  clear: () => {
    selection.set(initialSelection);
  },
  
  /**
   * Проверить, выбран ли блок
   */
  isSelected: (blockId: string): boolean => {
    const sel = get(selection);
    return sel.blockIds.includes(blockId);
  }
};

// ============================================================================
// Drag Operations
// ============================================================================

export const dragActions = {
  /**
   * Начать перетаскивание
   * @param blockId - ID блока
   * @param offset - смещение курсора от левого верхнего угла блока (в canvas координатах)
   * @param blockPosition - текущая позиция блока
   */
  start: (blockId: string, offset: Position, blockPosition: Position) => {
    dragState.set({
      isDragging: true,
      blockId,
      startPosition: blockPosition,
      currentPosition: blockPosition,
      offset: offset
    });
  },
  
  /**
   * Обновить позицию при перетаскивании (не используется, обновление происходит в Canvas)
   */
  update: (mousePosition: Position) => {
    // Не используется, оставлено для обратной совместимости
  },
  
  /**
   * Закончить перетаскивание
   */
  end: () => {
    dragState.set(initialDragState);
  },
  
  /**
   * Отменить перетаскивание
   */
  cancel: () => {
    const state = get(dragState);
    
    // Вернуть блок на начальную позицию
    if (state.blockId && state.startPosition) {
      blocksActions.move(state.blockId, state.startPosition);
    }
    
    dragState.set(initialDragState);
  }
};

// ============================================================================
// Resize Operations
// ============================================================================

export const resizeActions = {
  /**
   * Начать изменение размера
   */
  start: (blockId: string, handle: ResizeHandle, block: Block) => {
    resizeState.set({
      isResizing: true,
      blockId,
      handle,
      startSize: block.size,
      startPosition: block.position,
      aspectRatio: block.size.width / block.size.height
    });
  },
  
  /**
   * Обновить размер
   */
  update: (deltaX: number, deltaY: number, maintainAspectRatio: boolean = false) => {
    const state = get(resizeState);
    if (!state.isResizing || !state.blockId || !state.startSize || !state.startPosition) return;
    
    let newSize: Size = { ...state.startSize };
    let newPosition: Position = { ...state.startPosition };
    
    // Логика изменения размера зависит от ручки
    switch (state.handle) {
      case 'bottom-right':
        newSize.width = Math.max(20, state.startSize.width + deltaX);
        newSize.height = Math.max(20, state.startSize.height + deltaY);
        break;
        
      case 'bottom-left':
        newSize.width = Math.max(20, state.startSize.width - deltaX);
        newSize.height = Math.max(20, state.startSize.height + deltaY);
        newPosition.x = state.startPosition.x + deltaX;
        break;
        
      case 'top-right':
        newSize.width = Math.max(20, state.startSize.width + deltaX);
        newSize.height = Math.max(20, state.startSize.height - deltaY);
        newPosition.y = state.startPosition.y + deltaY;
        break;
        
      case 'top-left':
        newSize.width = Math.max(20, state.startSize.width - deltaX);
        newSize.height = Math.max(20, state.startSize.height - deltaY);
        newPosition.x = state.startPosition.x + deltaX;
        newPosition.y = state.startPosition.y + deltaY;
        break;
        
      case 'right':
        newSize.width = Math.max(20, state.startSize.width + deltaX);
        break;
        
      case 'left':
        newSize.width = Math.max(20, state.startSize.width - deltaX);
        newPosition.x = state.startPosition.x + deltaX;
        break;
        
      case 'bottom':
        newSize.height = Math.max(20, state.startSize.height + deltaY);
        break;
        
      case 'top':
        newSize.height = Math.max(20, state.startSize.height - deltaY);
        newPosition.y = state.startPosition.y + deltaY;
        break;
    }
    
    // Сохранение пропорций
    if (maintainAspectRatio && state.aspectRatio) {
      if (Math.abs(deltaX) > Math.abs(deltaY)) {
        newSize.height = newSize.width / state.aspectRatio;
      } else {
        newSize.width = newSize.height * state.aspectRatio;
      }
    }
    
    blocksActions.resize(state.blockId, newSize, newPosition);
  },
  
  /**
   * Закончить изменение размера
   */
  end: () => {
    resizeState.set(initialResizeState);
  },
  
  /**
   * Отменить изменение размера
   */
  cancel: () => {
    const state = get(resizeState);
    
    if (state.isResizing && state.blockId && state.startSize && state.startPosition) {
      blocksActions.resize(state.blockId, state.startSize, state.startPosition);
    }
    
    resizeState.set(initialResizeState);
  }
};

// ============================================================================
// Derived Stores
// ============================================================================

/**
 * Выбранные блоки
 */
export const selectedBlocks = derived(
  [blocks, selection],
  ([$blocks, $selection]) => {
    return $blocks.filter(block => $selection.blockIds.includes(block.id));
  }
);

/**
 * Первый выбранный блок (для Properties Panel)
 */
export const primarySelectedBlock = derived(
  selectedBlocks,
  ($selectedBlocks) => $selectedBlocks[0] || null
);

/**
 * Количество выбранных блоков
 */
export const selectedCount = derived(
  selection,
  ($selection) => $selection.blockIds.length
);

/**
 * Видимые блоки (не скрытые)
 */
export const visibleBlocks = derived(
  blocks,
  ($blocks) => $blocks.filter(block => block.visible)
);

/**
 * Блоки отсортированные по z-index
 */
export const sortedBlocks = derived(
  blocks,
  ($blocks) => [...$blocks].sort((a, b) => a.zIndex - b.zIndex)
);

// ============================================================================
// Утилиты
// ============================================================================

/**
 * Получить блок по ID
 */
export function getBlockById(blockId: string): Block | undefined {
  return get(blocks).find(b => b.id === blockId);
}

/**
 * Проверить, пересекается ли точка с блоком
 */
export function isPointInBlock(point: Position, block: Block): boolean {
  return (
    point.x >= block.position.x &&
    point.x <= block.position.x + block.size.width &&
    point.y >= block.position.y &&
    point.y <= block.position.y + block.size.height
  );
}

/**
 * Найти блок под курсором (самый верхний по z-index)
 */
export function getBlockAtPoint(point: Position): Block | null {
  const sorted = get(sortedBlocks).reverse(); // От верхних к нижним
  
  for (const block of sorted) {
    if (block.visible && !block.locked && isPointInBlock(point, block)) {
      return block;
    }
  }
  
  return null;
}

