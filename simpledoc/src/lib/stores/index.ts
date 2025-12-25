/**
 * Centralized Stores Export
 */

// Canvas
export { 
  canvasStore,
  scaledPageSize,
  canZoomIn,
  canZoomOut,
  screenToCanvas,
  canvasToScreen,
  snapToGrid,
  snapPositionToGrid
} from './canvas';

// Blocks
export {
  blocks,
  selection,
  dragState,
  resizeState,
  blocksActions,
  selectionActions,
  dragActions,
  resizeActions,
  selectedBlocks,
  primarySelectedBlock,
  selectedCount,
  visibleBlocks,
  sortedBlocks,
  getBlockById,
  isPointInBlock,
  getBlockAtPoint
} from './blocks';

// Document
export {
  currentDocument,
  autoSaveState,
  documentActions,
  pageActions,
  currentPage,
  hasDocument,
  canSave,
  documentTitle
} from './document';

// UI
export {
  ui,
  uiActions,
  keyboardShortcuts,
  hasNotifications,
  isModalOpen,
  canvasWidth
} from './ui';

// Legacy stores (для совместимости, если нужно)
export { templates } from './templates';

