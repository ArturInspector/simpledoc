/**
 * Main Types Export
 * Централизованный экспорт всех типов
 */

// Block types
export type {
  Block,
  BlockType,
  Position,
  Size,
  Transform,
  BlockStyles,
  TextBlockContent,
  ImageBlockContent,
  TableBlockContent,
  TableCell,
  SpacerBlockContent,
  BlockSelection,
  BlockDragState,
  BlockResizeState,
  ResizeHandle,
  Command,
  CommandType,
  BlockSnapshot
} from './blocks';

// Canvas types
export type {
  PageSize,
  PageConfig,
  CanvasConfig,
  Guide,
  CanvasState,
  ViewportTransform,
  ScreenCoordinates,
  CanvasCoordinates,
  CanvasInteraction
} from './canvas';

export { PAGE_SIZES, CANVAS_CONSTANTS } from './canvas';

// Document types
export type {
  Document,
  Page,
  DocumentMetadata,
  DocumentHistory,
  HistoryEntry,
  HistoryAction,
  DocumentSnapshot,
  ExportSettings,
  PDFExportSettings,
  DOCXExportSettings,
  ImageExportSettings,
  DocumentTemplate,
  TemplateCategory,
  PageTemplate,
  BlockTemplate,
  TemplateVariable,
  VariableType,
  VariableValidation,
  AutoSaveConfig,
  AutoSaveState
} from './document';

// App Settings (сохраняем старые для совместимости)
export interface AppSettings {
  theme: 'light' | 'dark' | 'auto';
  defaultSavePath: string;
  language: string;
  autoSave: boolean;
  canvas: {
    defaultZoom: number;
    showGrid: boolean;
    snapToGrid: boolean;
    gridSize: number;
  };
  export: {
    defaultFormat: 'pdf' | 'docx' | 'png';
    pdfQuality: 'low' | 'medium' | 'high' | 'print';
  };
}

// Notifications
export interface Notification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
  description?: string;
  duration?: number; // ms (null = manual close)
  timestamp: Date;
}

// UI State
export interface UIState {
  // Panels
  leftPanelOpen: boolean;
  leftPanelWidth: number;
  rightPanelOpen: boolean;
  rightPanelWidth: number;
  
  // Ribbon
  ribbonCollapsed: boolean;
  activeRibbonTab: string;
  
  // Modals
  activeModal: string | null;
  modalData: any;
  
  // Loading
  isLoading: boolean;
  loadingMessage: string | null;
  
  // Notifications
  notifications: Notification[];
}

// Keyboard shortcuts
export interface KeyboardShortcut {
  key: string;
  ctrl?: boolean;
  shift?: boolean;
  alt?: boolean;
  action: string;
  description: string;
}
