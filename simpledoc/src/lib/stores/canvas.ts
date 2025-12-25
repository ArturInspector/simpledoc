/**
 * Canvas Store - Управление холстом и viewport
 */

import { writable, derived, get } from 'svelte/store';
import type { 
  CanvasState, 
  CanvasConfig, 
  PageConfig,
  ScreenCoordinates,
  CanvasCoordinates,
  Guide 
} from '$lib/types/canvas';
import { PAGE_SIZES, CANVAS_CONSTANTS } from '$lib/types/canvas';

// ============================================================================
// Начальное состояние
// ============================================================================

const initialConfig: CanvasConfig = {
  zoom: CANVAS_CONSTANTS.DEFAULT_ZOOM,
  minZoom: CANVAS_CONSTANTS.MIN_ZOOM,
  maxZoom: CANVAS_CONSTANTS.MAX_ZOOM,
  zoomStep: CANVAS_CONSTANTS.ZOOM_STEP,
  
  showGrid: true,
  gridSize: CANVAS_CONSTANTS.GRID_SIZE,
  gridColor: '#e2e8f0',
  snapToGrid: true,
  
  showRulers: true,
  showGuides: true,
  guides: [],
  
  viewportOffset: { x: 0, y: 0 },
  
  renderQuality: 'high',
  antialiasing: true
};

const initialPageConfig: PageConfig = {
  id: 'page-1',
  size: PAGE_SIZES.A4,
  orientation: 'portrait',
  margins: {
    top: 20,
    right: 20,
    bottom: 20,
    left: 20
  },
  background: {
    color: '#ffffff',
    opacity: 1
  }
};

const initialState: CanvasState = {
  config: initialConfig,
  currentPage: initialPageConfig,
  isReady: false,
  isDraggingCanvas: false,
  cursorPosition: null
};

// ============================================================================
// Store
// ============================================================================

function createCanvasStore() {
  const { subscribe, set, update } = writable<CanvasState>(initialState);

  return {
    subscribe,
    
    // Инициализация canvas
    init: () => {
      update(state => ({ ...state, isReady: true }));
    },
    
    // Zoom управление
    setZoom: (zoom: number) => {
      update(state => {
        const newZoom = Math.max(
          state.config.minZoom,
          Math.min(state.config.maxZoom, zoom)
        );
        return {
          ...state,
          config: { ...state.config, zoom: newZoom }
        };
      });
    },
    
    zoomIn: () => {
      update(state => {
        const newZoom = Math.min(
          state.config.maxZoom,
          state.config.zoom + state.config.zoomStep
        );
        return {
          ...state,
          config: { ...state.config, zoom: newZoom }
        };
      });
    },
    
    zoomOut: () => {
      update(state => {
        const newZoom = Math.max(
          state.config.minZoom,
          state.config.zoom - state.config.zoomStep
        );
        return {
          ...state,
          config: { ...state.config, zoom: newZoom }
        };
      });
    },
    
    zoomToFit: (containerWidth: number, containerHeight: number) => {
      update(state => {
        const { widthPx, heightPx } = state.currentPage.size;
        const padding = CANVAS_CONSTANTS.CANVAS_PADDING * 2;
        
        const scaleX = (containerWidth - padding) / widthPx;
        const scaleY = (containerHeight - padding) / heightPx;
        const newZoom = Math.min(scaleX, scaleY, state.config.maxZoom);
        
        return {
          ...state,
          config: { ...state.config, zoom: newZoom }
        };
      });
    },
    
    resetZoom: () => {
      update(state => ({
        ...state,
        config: { ...state.config, zoom: CANVAS_CONSTANTS.DEFAULT_ZOOM }
      }));
    },
    
    // Viewport управление
    setViewportOffset: (x: number, y: number) => {
      update(state => ({
        ...state,
        config: {
          ...state.config,
          viewportOffset: { x, y }
        }
      }));
    },
    
    panViewport: (deltaX: number, deltaY: number) => {
      update(state => ({
        ...state,
        config: {
          ...state.config,
          viewportOffset: {
            x: state.config.viewportOffset.x + deltaX,
            y: state.config.viewportOffset.y + deltaY
          }
        }
      }));
    },
    
    centerViewport: () => {
      update(state => ({
        ...state,
        config: {
          ...state.config,
          viewportOffset: { x: 0, y: 0 }
        }
      }));
    },
    
    // Сетка
    toggleGrid: () => {
      update(state => ({
        ...state,
        config: { ...state.config, showGrid: !state.config.showGrid }
      }));
    },
    
    setGridSize: (size: number) => {
      update(state => ({
        ...state,
        config: { ...state.config, gridSize: size }
      }));
    },
    
    toggleSnapToGrid: () => {
      update(state => ({
        ...state,
        config: { ...state.config, snapToGrid: !state.config.snapToGrid }
      }));
    },
    
    // Направляющие
    addGuide: (guide: Guide) => {
      update(state => ({
        ...state,
        config: {
          ...state.config,
          guides: [...state.config.guides, guide]
        }
      }));
    },
    
    removeGuide: (guideId: string) => {
      update(state => ({
        ...state,
        config: {
          ...state.config,
          guides: state.config.guides.filter(g => g.id !== guideId)
        }
      }));
    },
    
    toggleGuides: () => {
      update(state => ({
        ...state,
        config: { ...state.config, showGuides: !state.config.showGuides }
      }));
    },
    
    toggleRulers: () => {
      update(state => ({
        ...state,
        config: { ...state.config, showRulers: !state.config.showRulers }
      }));
    },
    
    // Страница
    setPageSize: (pageSizeName: string) => {
      const pageSize = PAGE_SIZES[pageSizeName];
      if (!pageSize) return;
      
      update(state => ({
        ...state,
        currentPage: {
          ...state.currentPage,
          size: pageSize
        }
      }));
    },
    
    setPageOrientation: (orientation: 'portrait' | 'landscape') => {
      update(state => {
        const { width, height, widthPx, heightPx } = state.currentPage.size;
        
        // Свапаем размеры при смене ориентации
        const newSize = orientation === 'landscape'
          ? {
              ...state.currentPage.size,
              width: height,
              height: width,
              widthPx: heightPx,
              heightPx: widthPx
            }
          : state.currentPage.size;
        
        return {
          ...state,
          currentPage: {
            ...state.currentPage,
            orientation,
            size: newSize
          }
        };
      });
    },
    
    setPageMargins: (margins: { top: number; right: number; bottom: number; left: number }) => {
      update(state => ({
        ...state,
        currentPage: {
          ...state.currentPage,
          margins
        }
      }));
    },
    
    // Курсор
    setCursorPosition: (position: { x: number; y: number } | null) => {
      update(state => ({ ...state, cursorPosition: position }));
    },
    
    // Canvas dragging
    setCanvasDragging: (isDragging: boolean) => {
      update(state => ({ ...state, isDraggingCanvas: isDragging }));
    },
    
    // Reset
    reset: () => set(initialState)
  };
}

export const canvasStore = createCanvasStore();

// ============================================================================
// Derived Stores
// ============================================================================

// Размеры страницы с учетом zoom
export const scaledPageSize = derived(canvasStore, $canvas => ({
  width: $canvas.currentPage.size.widthPx * $canvas.config.zoom,
  height: $canvas.currentPage.size.heightPx * $canvas.config.zoom
}));

// Проверка, достигнут ли предел zoom
export const canZoomIn = derived(canvasStore, $canvas => 
  $canvas.config.zoom < $canvas.config.maxZoom
);

export const canZoomOut = derived(canvasStore, $canvas => 
  $canvas.config.zoom > $canvas.config.minZoom
);

// ============================================================================
// Утилиты координат
// ============================================================================

/**
 * Конвертация экранных координат в координаты холста
 */
export function screenToCanvas(
  screenCoords: ScreenCoordinates,
  canvasState: CanvasState
): CanvasCoordinates {
  const { zoom, viewportOffset } = canvasState.config;
  
  return {
    x: (screenCoords.x - viewportOffset.x) / zoom,
    y: (screenCoords.y - viewportOffset.y) / zoom
  };
}

/**
 * Конвертация координат холста в экранные координаты
 */
export function canvasToScreen(
  canvasCoords: CanvasCoordinates,
  canvasState: CanvasState
): ScreenCoordinates {
  const { zoom, viewportOffset } = canvasState.config;
  
  return {
    x: canvasCoords.x * zoom + viewportOffset.x,
    y: canvasCoords.y * zoom + viewportOffset.y
  };
}

/**
 * Привязка координат к сетке
 */
export function snapToGrid(value: number, gridSize: number): number {
  return Math.round(value / gridSize) * gridSize;
}

/**
 * Привязка позиции к сетке (если включено)
 */
export function snapPositionToGrid(
  position: { x: number; y: number },
  canvasState: CanvasState
): { x: number; y: number } {
  if (!canvasState.config.snapToGrid) {
    return position;
  }
  
  const gridSize = canvasState.config.gridSize;
  
  return {
    x: snapToGrid(position.x, gridSize),
    y: snapToGrid(position.y, gridSize)
  };
}

