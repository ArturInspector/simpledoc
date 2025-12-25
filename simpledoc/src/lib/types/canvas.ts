/**
 * Canvas Types - Типы для холста и страниц
 */

// ============================================================================
// Размеры страниц (ISO стандарты)
// ============================================================================

export interface PageSize {
  name: string;
  width: number;   // в мм
  height: number;  // в мм
  widthPx: number; // в пикселях при 96 DPI
  heightPx: number;
}

// Стандартные размеры (96 DPI: 1 мм = 3.7795 px)
export const PAGE_SIZES: Record<string, PageSize> = {
  A4: {
    name: 'A4',
    width: 210,
    height: 297,
    widthPx: 794,   // 210mm * 3.7795
    heightPx: 1123  // 297mm * 3.7795
  },
  A3: {
    name: 'A3',
    width: 297,
    height: 420,
    widthPx: 1123,
    heightPx: 1587
  },
  LETTER: {
    name: 'Letter',
    width: 215.9,
    height: 279.4,
    widthPx: 816,
    heightPx: 1056
  },
  LEGAL: {
    name: 'Legal',
    width: 215.9,
    height: 355.6,
    widthPx: 816,
    heightPx: 1344
  }
};

// ============================================================================
// Конфигурация страницы
// ============================================================================

export interface PageConfig {
  id: string;
  size: PageSize;
  orientation: 'portrait' | 'landscape';
  margins: {
    top: number;    // в мм
    right: number;
    bottom: number;
    left: number;
  };
  background: {
    color: string;
    image?: string;  // путь к фоновому изображению
    opacity: number;
  };
}

// ============================================================================
// Конфигурация Canvas
// ============================================================================

export interface CanvasConfig {
  // Масштабирование
  zoom: number;           // 0.1 - 5.0 (10% - 500%)
  minZoom: number;
  maxZoom: number;
  zoomStep: number;       // шаг изменения zoom (обычно 0.1)
  
  // Сетка
  showGrid: boolean;
  gridSize: number;       // размер ячейки сетки в px (обычно 8px)
  gridColor: string;
  snapToGrid: boolean;    // привязка к сетке
  
  // Направляющие
  showRulers: boolean;
  showGuides: boolean;
  guides: Guide[];        // массив направляющих линий
  
  // Viewport
  viewportOffset: {
    x: number;            // смещение viewport по X
    y: number;            // смещение viewport по Y
  };
  
  // Настройки отрисовки
  renderQuality: 'low' | 'medium' | 'high';
  antialiasing: boolean;
}

export interface Guide {
  id: string;
  orientation: 'horizontal' | 'vertical';
  position: number;       // в пикселях от края
  color: string;
  locked: boolean;
}

// ============================================================================
// Состояние Canvas
// ============================================================================

export interface CanvasState {
  config: CanvasConfig;
  currentPage: PageConfig;
  isReady: boolean;       // canvas инициализирован
  isDraggingCanvas: boolean; // перетаскивание самого холста (pan)
  cursorPosition: {
    x: number;
    y: number;
  } | null;
}

// ============================================================================
// Viewport утилиты
// ============================================================================

export interface ViewportTransform {
  scale: number;          // = zoom
  translateX: number;     // смещение по X
  translateY: number;     // смещение по Y
}

// Координаты в разных системах
export interface ScreenCoordinates {
  x: number;
  y: number;
}

export interface CanvasCoordinates {
  x: number;
  y: number;
}

// ============================================================================
// История взаимодействия с Canvas
// ============================================================================

export interface CanvasInteraction {
  type: 'zoom' | 'pan' | 'select' | 'drag' | 'resize';
  timestamp: Date;
  data: any;
}

// ============================================================================
// Константы
// ============================================================================

export const CANVAS_CONSTANTS = {
  DEFAULT_ZOOM: 1.0,
  MIN_ZOOM: 0.1,
  MAX_ZOOM: 5.0,
  ZOOM_STEP: 0.1,
  GRID_SIZE: 8,           // px
  RULER_SIZE: 30,         // px (высота/ширина линейки)
  CANVAS_PADDING: 40,     // px (отступ вокруг страницы)
  SELECTION_THRESHOLD: 5, // px (радиус для клика по элементу)
  SNAP_THRESHOLD: 10,     // px (порог для snap to grid)
  DPI: 96,                // пикселей на дюйм
  MM_TO_PX: 3.7795,       // коэффициент конвертации мм в px
} as const;

