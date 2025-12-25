/**
 * Block Factory - Создание блоков разных типов
 */

import type { 
  Block, 
  BlockType,
  Position,
  Size,
  TextBlockContent,
  ImageBlockContent,
  TableBlockContent,
  SpacerBlockContent
} from '$lib/types/blocks';

// ============================================================================
// Дефолтные значения
// ============================================================================

const DEFAULT_POSITION: Position = { x: 100, y: 100 };
const DEFAULT_TEXT_SIZE: Size = { width: 400, height: 100 };
const DEFAULT_IMAGE_SIZE: Size = { width: 300, height: 200 };
const DEFAULT_TABLE_SIZE: Size = { width: 500, height: 300 };
const DEFAULT_SPACER_SIZE: Size = { width: 400, height: 50 };

// ============================================================================
// Factory Functions
// ============================================================================

/**
 * Базовая функция создания блока
 */
function createBaseBlock(
  type: BlockType,
  position: Position = DEFAULT_POSITION,
  size: Size,
  content: any
): Block {
  return {
    id: crypto.randomUUID(),
    type,
    position,
    size,
    transform: {
      rotation: 0,
      scaleX: 1,
      scaleY: 1
    },
    zIndex: 0,
    locked: false,
    visible: true,
    content,
    styles: {
      padding: {
        top: 0,
        right: 0,
        bottom: 0,
        left: 0
      },
      border: {
        width: 0,
        color: '#000000',
        style: 'solid',
        radius: 0
      },
      background: {
        color: 'transparent',
        opacity: 1
      }
    },
    metadata: {
      createdAt: new Date(),
      updatedAt: new Date(),
      version: 1
    }
  };
}

/**
 * Создать текстовый блок
 */
export function createTextBlock(
  text: string = 'Text Block',
  position?: Position,
  options?: Partial<TextBlockContent>
): Block {
  const content: TextBlockContent = {
    text,
    fontSize: 16,
    fontFamily: 'Inter',
    fontWeight: 400,
    lineHeight: 1.5,
    letterSpacing: 0,
    color: '#1e293b',
    alignment: 'left',
    textDecoration: 'none',
    isEditable: true,
    ...options
  };
  
  return createBaseBlock('text', position, DEFAULT_TEXT_SIZE, content);
}

/**
 * Создать заголовок (H1, H2, H3)
 */
export function createHeadingBlock(
  text: string = 'Heading',
  level: 1 | 2 | 3 = 1,
  position?: Position
): Block {
  const fontSizes = { 1: 32, 2: 24, 3: 20 };
  const fontWeights = { 1: 700, 2: 600, 3: 600 };
  
  return createTextBlock(text, position, {
    fontSize: fontSizes[level],
    fontWeight: fontWeights[level],
    color: '#0f172a'
  });
}

/**
 * Создать параграф
 */
export function createParagraphBlock(
  text: string = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
  position?: Position
): Block {
  return createTextBlock(text, position, {
    fontSize: 14,
    lineHeight: 1.6,
    color: '#475569'
  });
}

/**
 * Создать блок изображения
 */
export function createImageBlock(
  src: string = '',
  position?: Position,
  options?: Partial<ImageBlockContent>
): Block {
  const content: ImageBlockContent = {
    src,
    alt: 'Image',
    objectFit: 'contain',
    opacity: 1,
    filters: {
      brightness: 100,
      contrast: 100,
      saturation: 100,
      blur: 0
    },
    ...options
  };
  
  return createBaseBlock('image', position, DEFAULT_IMAGE_SIZE, content);
}

/**
 * Создать блок таблицы
 */
export function createTableBlock(
  rows: number = 3,
  cols: number = 3,
  position?: Position
): Block {
  const cells = Array(rows).fill(null).map(() =>
    Array(cols).fill(null).map(() => ({
      content: '',
      colspan: 1,
      rowspan: 1,
      alignment: 'left' as const,
      backgroundColor: '#ffffff',
      textColor: '#1e293b',
      fontSize: 14,
      fontWeight: 400
    }))
  );
  
  const columnWidths = Array(cols).fill(DEFAULT_TABLE_SIZE.width / cols);
  const rowHeights = Array(rows).fill(DEFAULT_TABLE_SIZE.height / rows);
  
  const content: TableBlockContent = {
    rows,
    cols,
    cells,
    columnWidths,
    rowHeights,
    borderWidth: 1,
    borderColor: '#cbd5e1',
    cellPadding: 8
  };
  
  return createBaseBlock('table', position, DEFAULT_TABLE_SIZE, content);
}

/**
 * Создать блок-разделитель (spacer)
 */
export function createSpacerBlock(
  height: number = 50,
  position?: Position
): Block {
  const content: SpacerBlockContent = {};
  const size: Size = { ...DEFAULT_SPACER_SIZE, height };
  
  return createBaseBlock('spacer', position, size, content);
}

// ============================================================================
// Bulk Operations
// ============================================================================

/**
 * Создать несколько блоков одновременно
 */
export function createMultipleBlocks(
  blockType: BlockType,
  count: number,
  startPosition: Position = DEFAULT_POSITION,
  spacing: number = 20
): Block[] {
  const blocks: Block[] = [];
  
  for (let i = 0; i < count; i++) {
    const position: Position = {
      x: startPosition.x,
      y: startPosition.y + i * spacing
    };
    
    let block: Block;
    switch (blockType) {
      case 'text':
        block = createTextBlock('Text Block', position);
        break;
      case 'image':
        block = createImageBlock('', position);
        break;
      case 'table':
        block = createTableBlock(3, 3, position);
        break;
      case 'spacer':
        block = createSpacerBlock(50, position);
        break;
      default:
        continue;
    }
    
    // Устанавливаем z-index
    block.zIndex = i;
    blocks.push(block);
  }
  
  return blocks;
}

/**
 * Клонировать блок
 */
export function cloneBlock(block: Block, offset: Position = { x: 20, y: 20 }): Block {
  return {
    ...block,
    id: crypto.randomUUID(),
    position: {
      x: block.position.x + offset.x,
      y: block.position.y + offset.y
    },
    metadata: {
      createdAt: new Date(),
      updatedAt: new Date(),
      version: 1
    }
  };
}

// ============================================================================
// Validation
// ============================================================================

/**
 * Проверить корректность блока
 */
export function validateBlock(block: Block): boolean {
  if (!block.id || typeof block.id !== 'string') return false;
  if (!block.type) return false;
  if (!block.position || typeof block.position.x !== 'number' || typeof block.position.y !== 'number') return false;
  if (!block.size || typeof block.size.width !== 'number' || typeof block.size.height !== 'number') return false;
  if (block.size.width <= 0 || block.size.height <= 0) return false;
  
  return true;
}

/**
 * Исправить некорректные значения блока
 */
export function sanitizeBlock(block: Block): Block {
  return {
    ...block,
    size: {
      width: Math.max(20, block.size.width),
      height: Math.max(20, block.size.height)
    },
    position: {
      x: Math.max(0, block.position.x),
      y: Math.max(0, block.position.y)
    },
    zIndex: Math.max(0, Math.min(999, block.zIndex))
  };
}

