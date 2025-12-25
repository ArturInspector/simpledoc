/**
 * Block Types - Типы данных для блочного редактора
 * Следует принципам: простота, расширяемость, типобезопасность
 */

// ============================================================================
// Базовые типы блоков
// ============================================================================

export type BlockType = 'text' | 'image' | 'table' | 'spacer' | 'shape' | 'line';

export interface Position {
  x: number; // в пикселях от левого края страницы
  y: number; // в пикселях от верхнего края страницы
}

export interface Size {
  width: number;  // в пикселях
  height: number; // в пикселях
}

export interface Transform {
  rotation: number; // в градусах (0-360)
  scaleX: number;   // масштаб по X (1 = 100%)
  scaleY: number;   // масштаб по Y (1 = 100%)
}

// ============================================================================
// Стили блоков
// ============================================================================

export interface BlockStyles {
  // Layout
  padding?: {
    top: number;
    right: number;
    bottom: number;
    left: number;
  };
  
  // Borders
  border?: {
    width: number;
    color: string;
    style: 'solid' | 'dashed' | 'dotted' | 'none';
    radius: number;
  };
  
  // Background
  background?: {
    color: string;
    opacity: number; // 0-1
  };
  
  // Shadow
  shadow?: {
    offsetX: number;
    offsetY: number;
    blur: number;
    color: string;
  };
}

// ============================================================================
// Контент блоков (по типам)
// ============================================================================

export interface TextBlockContent {
  text: string;
  fontSize: number;      // в px
  fontFamily: string;    // 'Inter', 'Roboto', etc.
  fontWeight: number;    // 400, 500, 600, 700
  lineHeight: number;    // множитель (1.5 = 150%)
  letterSpacing: number; // в px
  color: string;         // hex color
  alignment: 'left' | 'center' | 'right' | 'justify';
  textDecoration?: 'none' | 'underline' | 'line-through';
  isEditable: boolean;   // можно ли редактировать inline
}

export interface ImageBlockContent {
  src: string;           // путь к файлу или base64
  alt: string;
  objectFit: 'contain' | 'cover' | 'fill' | 'none';
  opacity: number;       // 0-1
  filters?: {
    brightness: number;  // 0-200 (100 = normal)
    contrast: number;    // 0-200
    saturation: number;  // 0-200
    blur: number;        // в px
  };
}

export interface TableBlockContent {
  rows: number;
  cols: number;
  cells: TableCell[][];  // 2D массив ячеек
  columnWidths: number[]; // ширина каждой колонки
  rowHeights: number[];   // высота каждой строки
  borderWidth: number;
  borderColor: string;
  cellPadding: number;
}

export interface TableCell {
  content: string;
  colspan: number;
  rowspan: number;
  alignment: 'left' | 'center' | 'right';
  backgroundColor?: string;
  textColor?: string;
  fontSize?: number;
  fontWeight?: number;
}

export interface SpacerBlockContent {
  // Пустой блок для отступов (только размер важен)
}

// ============================================================================
// Главная структура блока
// ============================================================================

export interface Block {
  id: string;                    // уникальный ID (UUID)
  type: BlockType;
  position: Position;
  size: Size;
  transform: Transform;
  zIndex: number;                // порядок наложения (0-999)
  locked: boolean;               // нельзя перемещать/редактировать
  visible: boolean;              // показывать/скрывать
  name?: string;                 // опциональное имя для поиска
  
  // Контент (зависит от типа)
  content: TextBlockContent | ImageBlockContent | TableBlockContent | SpacerBlockContent;
  
  // Стили
  styles: BlockStyles;
  
  // Метаданные
  metadata: {
    createdAt: Date;
    updatedAt: Date;
    version: number;             // для истории изменений
  };
}

// ============================================================================
// Вспомогательные типы для редактора
// ============================================================================

export interface BlockSelection {
  blockIds: string[];            // выбранные блоки
  mode: 'single' | 'multiple';
  anchorPoint?: Position;        // точка начала выделения
}

export interface BlockDragState {
  isDragging: boolean;
  blockId: string | null;
  startPosition: Position | null;
  currentPosition: Position | null;
  offset: Position | null;       // смещение курсора от угла блока
}

export interface BlockResizeState {
  isResizing: boolean;
  blockId: string | null;
  handle: ResizeHandle | null;   // какая ручка активна
  startSize: Size | null;
  startPosition: Position | null;
  aspectRatio?: number;          // для сохранения пропорций
}

export type ResizeHandle = 
  | 'top-left' 
  | 'top-right' 
  | 'bottom-left' 
  | 'bottom-right'
  | 'top' 
  | 'right' 
  | 'bottom' 
  | 'left';

// ============================================================================
// Команды для истории (undo/redo)
// ============================================================================

export interface Command {
  id: string;
  type: CommandType;
  timestamp: Date;
  execute: () => void;
  undo: () => void;
}

export type CommandType = 
  | 'add_block'
  | 'delete_block'
  | 'move_block'
  | 'resize_block'
  | 'update_content'
  | 'update_styles'
  | 'reorder_blocks';

// ============================================================================
// Снэпшоты для истории
// ============================================================================

export interface BlockSnapshot {
  blockId: string;
  before: Partial<Block>;
  after: Partial<Block>;
}

