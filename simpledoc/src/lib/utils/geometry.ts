/**
 * Geometry Utils - Утилиты для работы с геометрией блоков
 */

import type { Position, Size, Block } from '$lib/types/blocks';

// ============================================================================
// Distance & Collision
// ============================================================================

/**
 * Вычислить расстояние между двумя точками
 */
export function distance(p1: Position, p2: Position): number {
  const dx = p2.x - p1.x;
  const dy = p2.y - p1.y;
  return Math.sqrt(dx * dx + dy * dy);
}

/**
 * Проверить, находится ли точка внутри прямоугольника
 */
export function isPointInRect(
  point: Position,
  rect: { position: Position; size: Size }
): boolean {
  return (
    point.x >= rect.position.x &&
    point.x <= rect.position.x + rect.size.width &&
    point.y >= rect.position.y &&
    point.y <= rect.position.y + rect.size.height
  );
}

/**
 * Проверить пересечение двух прямоугольников
 */
export function doRectsIntersect(
  rect1: { position: Position; size: Size },
  rect2: { position: Position; size: Size }
): boolean {
  return !(
    rect1.position.x + rect1.size.width < rect2.position.x ||
    rect2.position.x + rect2.size.width < rect1.position.x ||
    rect1.position.y + rect1.size.height < rect2.position.y ||
    rect2.position.y + rect2.size.height < rect1.position.y
  );
}

/**
 * Получить центр прямоугольника
 */
export function getRectCenter(rect: { position: Position; size: Size }): Position {
  return {
    x: rect.position.x + rect.size.width / 2,
    y: rect.position.y + rect.size.height / 2
  };
}

/**
 * Получить угловые точки прямоугольника
 */
export function getRectCorners(rect: { position: Position; size: Size }): Position[] {
  return [
    { x: rect.position.x, y: rect.position.y }, // top-left
    { x: rect.position.x + rect.size.width, y: rect.position.y }, // top-right
    { x: rect.position.x, y: rect.position.y + rect.size.height }, // bottom-left
    { x: rect.position.x + rect.size.width, y: rect.position.y + rect.size.height } // bottom-right
  ];
}

// ============================================================================
// Bounds & Containment
// ============================================================================

/**
 * Получить границы (bounding box) для группы блоков
 */
export function getBoundsForBlocks(blocks: Block[]): { position: Position; size: Size } | null {
  if (blocks.length === 0) return null;
  
  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;
  
  for (const block of blocks) {
    minX = Math.min(minX, block.position.x);
    minY = Math.min(minY, block.position.y);
    maxX = Math.max(maxX, block.position.x + block.size.width);
    maxY = Math.max(maxY, block.position.y + block.size.height);
  }
  
  return {
    position: { x: minX, y: minY },
    size: { width: maxX - minX, height: maxY - minY }
  };
}

/**
 * Проверить, находится ли блок внутри границ страницы
 */
export function isBlockInPageBounds(block: Block, pageSize: Size): boolean {
  return (
    block.position.x >= 0 &&
    block.position.y >= 0 &&
    block.position.x + block.size.width <= pageSize.width &&
    block.position.y + block.size.height <= pageSize.height
  );
}

/**
 * Ограничить позицию блока границами страницы
 */
export function clampBlockToPage(
  position: Position,
  blockSize: Size,
  pageSize: Size
): Position {
  return {
    x: Math.max(0, Math.min(pageSize.width - blockSize.width, position.x)),
    y: Math.max(0, Math.min(pageSize.height - blockSize.height, position.y))
  };
}

// ============================================================================
// Alignment & Distribution
// ============================================================================

/**
 * Выровнять блоки по левому краю
 */
export function alignBlocksLeft(blocks: Block[]): Block[] {
  if (blocks.length === 0) return [];
  
  const minX = Math.min(...blocks.map(b => b.position.x));
  
  return blocks.map(block => ({
    ...block,
    position: { ...block.position, x: minX }
  }));
}

/**
 * Выровнять блоки по правому краю
 */
export function alignBlocksRight(blocks: Block[]): Block[] {
  if (blocks.length === 0) return [];
  
  const maxX = Math.max(...blocks.map(b => b.position.x + b.size.width));
  
  return blocks.map(block => ({
    ...block,
    position: { ...block.position, x: maxX - block.size.width }
  }));
}

/**
 * Выровнять блоки по верхнему краю
 */
export function alignBlocksTop(blocks: Block[]): Block[] {
  if (blocks.length === 0) return [];
  
  const minY = Math.min(...blocks.map(b => b.position.y));
  
  return blocks.map(block => ({
    ...block,
    position: { ...block.position, y: minY }
  }));
}

/**
 * Выровнять блоки по нижнему краю
 */
export function alignBlocksBottom(blocks: Block[]): Block[] {
  if (blocks.length === 0) return [];
  
  const maxY = Math.max(...blocks.map(b => b.position.y + b.size.height));
  
  return blocks.map(block => ({
    ...block,
    position: { ...block.position, y: maxY - block.size.height }
  }));
}

/**
 * Выровнять блоки по центру (горизонтально)
 */
export function alignBlocksCenterHorizontal(blocks: Block[]): Block[] {
  if (blocks.length === 0) return [];
  
  const centers = blocks.map(b => b.position.x + b.size.width / 2);
  const avgCenter = centers.reduce((sum, c) => sum + c, 0) / centers.length;
  
  return blocks.map(block => ({
    ...block,
    position: { ...block.position, x: avgCenter - block.size.width / 2 }
  }));
}

/**
 * Выровнять блоки по центру (вертикально)
 */
export function alignBlocksCenterVertical(blocks: Block[]): Block[] {
  if (blocks.length === 0) return [];
  
  const centers = blocks.map(b => b.position.y + b.size.height / 2);
  const avgCenter = centers.reduce((sum, c) => sum + c, 0) / centers.length;
  
  return blocks.map(block => ({
    ...block,
    position: { ...block.position, y: avgCenter - block.size.height / 2 }
  }));
}

/**
 * Распределить блоки равномерно по горизонтали
 */
export function distributeBlocksHorizontally(blocks: Block[]): Block[] {
  if (blocks.length < 3) return blocks;
  
  const sorted = [...blocks].sort((a, b) => a.position.x - b.position.x);
  
  const minX = sorted[0].position.x;
  const maxX = sorted[sorted.length - 1].position.x + sorted[sorted.length - 1].size.width;
  const totalWidth = sorted.reduce((sum, b) => sum + b.size.width, 0);
  const spacing = (maxX - minX - totalWidth) / (sorted.length - 1);
  
  let currentX = minX;
  
  return sorted.map(block => {
    const newBlock = {
      ...block,
      position: { ...block.position, x: currentX }
    };
    currentX += block.size.width + spacing;
    return newBlock;
  });
}

/**
 * Распределить блоки равномерно по вертикали
 */
export function distributeBlocksVertically(blocks: Block[]): Block[] {
  if (blocks.length < 3) return blocks;
  
  const sorted = [...blocks].sort((a, b) => a.position.y - b.position.y);
  
  const minY = sorted[0].position.y;
  const maxY = sorted[sorted.length - 1].position.y + sorted[sorted.length - 1].size.height;
  const totalHeight = sorted.reduce((sum, b) => sum + b.size.height, 0);
  const spacing = (maxY - minY - totalHeight) / (sorted.length - 1);
  
  let currentY = minY;
  
  return sorted.map(block => {
    const newBlock = {
      ...block,
      position: { ...block.position, y: currentY }
    };
    currentY += block.size.height + spacing;
    return newBlock;
  });
}

// ============================================================================
// Measurement
// ============================================================================

/**
 * Вычислить площадь блока
 */
export function getBlockArea(block: Block): number {
  return block.size.width * block.size.height;
}

/**
 * Вычислить периметр блока
 */
export function getBlockPerimeter(block: Block): number {
  return 2 * (block.size.width + block.size.height);
}

/**
 * Вычислить диагональ блока
 */
export function getBlockDiagonal(block: Block): number {
  return Math.sqrt(
    block.size.width * block.size.width + 
    block.size.height * block.size.height
  );
}

