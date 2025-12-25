<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import { canvasStore, scaledPageSize, blocks, selection, dragState, resizeState, dragActions, resizeActions, selectionActions, blocksActions } from '$lib/stores';
  import { screenToCanvas, canvasToScreen } from '$lib/stores/canvas';
  import { CANVAS_CONSTANTS } from '$lib/types/canvas';
  import { get } from 'svelte/store';
  import BlockRenderer from './BlockRenderer.svelte';
  import Grid from './Grid.svelte';
  import SelectionBox from './SelectionBox.svelte';
  
  // ============================================================================
  // Props
  // ============================================================================
  
  let canvasContainer: HTMLDivElement;
  let canvasElement: HTMLCanvasElement;
  let ctx: CanvasRenderingContext2D | null = null;
  
  // ============================================================================
  // Reactive State
  // ============================================================================
  
  $: canvas = $canvasStore;
  $: pageSize = $scaledPageSize;
  $: allBlocks = $blocks;
  
  // ============================================================================
  // Canvas Setup
  // ============================================================================
  
  onMount(() => {
    if (canvasElement) {
      ctx = canvasElement.getContext('2d');
      canvasStore.init();
      
      // Центрируем viewport при загрузке
      centerViewportOnPage();
      
      // Fit zoom to container
      if (canvasContainer) {
        canvasStore.zoomToFit(canvasContainer.clientWidth, canvasContainer.clientHeight);
      }
    }
    
    // Event listeners
    window.addEventListener('resize', handleResize);
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('mousemove', handleGlobalMouseMove);
    window.addEventListener('mouseup', handleGlobalMouseUp);
    
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('mousemove', handleGlobalMouseMove);
      window.removeEventListener('mouseup', handleGlobalMouseUp);
    };
  });
  
  // ============================================================================
  // Interaction Handlers
  // ============================================================================
  
  let isPanning = false;
  let panStart = { x: 0, y: 0 };
  
  function handleMouseDown(e: MouseEvent) {
    // Space + mouse = pan canvas
    if (e.button === 1 || (e.button === 0 && e.spaceKey)) {
      isPanning = true;
      panStart = { x: e.clientX, y: e.clientY };
      canvasStore.setCanvasDragging(true);
      e.preventDefault();
      return;
    }
    
    // Left click на пустом месте = deselect
    const canvasCoords = screenToCanvas(
      { x: e.offsetX, y: e.offsetY },
      get(canvasStore)
    );
    
    // Проверим, кликнули ли мы на блок (обработается в BlockRenderer)
  }
  
  function handleMouseMove(e: MouseEvent) {
    const canvasCoords = screenToCanvas(
      { x: e.offsetX, y: e.offsetY },
      get(canvasStore)
    );
    
    canvasStore.setCursorPosition(canvasCoords);
    
    // Panning
    if (isPanning) {
      const deltaX = e.clientX - panStart.x;
      const deltaY = e.clientY - panStart.y;
      
      canvasStore.panViewport(deltaX, deltaY);
      
      panStart = { x: e.clientX, y: e.clientY };
    }
  }
  
  function handleMouseUp(e: MouseEvent) {
    if (isPanning) {
      isPanning = false;
      canvasStore.setCanvasDragging(false);
    }
  }
  
  // Global handlers for drag operations
  function handleGlobalMouseMove(e: MouseEvent) {
    const drag = get(dragState);
    const resize = get(resizeState);
    
    if (drag.isDragging && drag.blockId && drag.offset) {
      e.preventDefault();
      
      const canvasState = get(canvasStore);
      const zoom = canvasState.config.zoom;
      const offset = canvasState.config.viewportOffset;
      
      // Получаем позицию мыши относительно container
      const rect = canvasContainer?.getBoundingClientRect();
      if (!rect) return;
      
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;
      
      // Конвертируем в canvas координаты (учитывая viewport offset и zoom)
      const canvasX = (mouseX - offset.x) / zoom;
      const canvasY = (mouseY - offset.y) / zoom;
      
      // Применяем offset от начала drag
      const newX = canvasX - drag.offset.x;
      const newY = canvasY - drag.offset.y;
      
      // Сразу обновляем позицию блока
      blocksActions.move(drag.blockId, { x: newX, y: newY });
    }
    
    if (resize.isResizing && resize.blockId) {
      e.preventDefault();
      // TODO: Implement resize logic
    }
  }
  
  function handleGlobalMouseUp(e: MouseEvent) {
    const drag = get(dragState);
    const resize = get(resizeState);
    
    if (drag.isDragging) {
      dragActions.end();
    }
    
    if (resize.isResizing) {
      resizeActions.end();
    }
  }
  
  function handleWheel(e: WheelEvent) {
    // Ctrl/Cmd + wheel = zoom
    if (e.ctrlKey || e.metaKey) {
      e.preventDefault();
      
      const delta = -e.deltaY;
      if (delta > 0) {
        canvasStore.zoomIn();
      } else {
        canvasStore.zoomOut();
      }
    } else {
      // Scroll canvas
      canvasStore.panViewport(-e.deltaX, -e.deltaY);
    }
  }
  
  function handleKeyDown(e: KeyboardEvent) {
    // Delete/Backspace = delete selected blocks
    if (e.key === 'Delete' || e.key === 'Backspace') {
      const sel = get(selection);
      if (sel.blockIds.length > 0) {
        e.preventDefault();
        sel.blockIds.forEach(blockId => {
          blocksActions.remove(blockId);
        });
      }
    }
    
    // Escape = deselect
    if (e.key === 'Escape') {
      selectionActions.clear();
    }
  }
  
  function handleResize() {
    if (canvasContainer) {
      // Можно обновить zoom для fit
    }
  }
  
  // ============================================================================
  // Helper Functions
  // ============================================================================
  
  function centerViewportOnPage() {
    if (!canvasContainer) return;
    
    const containerWidth = canvasContainer.clientWidth;
    const containerHeight = canvasContainer.clientHeight;
    const zoom = canvas.config.zoom;
    
    const pageWidth = canvas.currentPage.size.widthPx * zoom;
    const pageHeight = canvas.currentPage.size.heightPx * zoom;
    
    const offsetX = (containerWidth - pageWidth) / 2;
    const offsetY = (containerHeight - pageHeight) / 2;
    
    canvasStore.setViewportOffset(offsetX, offsetY);
  }
</script>

<div
  class="canvas-container"
  bind:this={canvasContainer}
  on:mousedown={handleMouseDown}
  on:mousemove={handleMouseMove}
  on:mouseup={handleMouseUp}
  on:wheel={handleWheel}
  role="application"
  aria-label="Document Canvas"
>
  <!-- Background Canvas (Grid, Guides) -->
  <canvas
    bind:this={canvasElement}
    class="canvas-background"
    width={canvasContainer?.clientWidth || 800}
    height={canvasContainer?.clientHeight || 600}
  />
  
  <!-- Canvas Content (Page + Blocks) -->
  <div 
    class="canvas-content"
    style="
      transform: translate({canvas.config.viewportOffset.x}px, {canvas.config.viewportOffset.y}px) scale({canvas.config.zoom});
      transform-origin: top left;
    "
  >
    <!-- Page Surface (A4) -->
    <div 
      class="page"
      style="
        width: {canvas.currentPage.size.widthPx}px;
        height: {canvas.currentPage.size.heightPx}px;
        background-color: {canvas.currentPage.background.color};
      "
      role="region"
      aria-label="Document Page"
    >
      <!-- Grid Overlay -->
      {#if canvas.config.showGrid}
        <Grid 
          gridSize={canvas.config.gridSize} 
          pageWidth={canvas.currentPage.size.widthPx}
          pageHeight={canvas.currentPage.size.heightPx}
        />
      {/if}
      
      <!-- Blocks -->
      {#each allBlocks as block (block.id)}
        {#if block.visible}
          <BlockRenderer {block} />
        {/if}
      {/each}
      
      <!-- Selection Box -->
      <SelectionBox />
    </div>
  </div>
  
  <!-- Canvas Overlays (Rulers, Guides) -->
  {#if canvas.config.showRulers}
    <div class="rulers">
      <!-- TODO: Ruler components -->
    </div>
  {/if}
</div>

<style>
  .canvas-container {
    position: relative;
    width: 100%;
    height: 100%;
    overflow: hidden;
    background: linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%);
    cursor: default;
    user-select: none;
  }
  
  .canvas-container:active {
    cursor: grabbing;
  }
  
  .canvas-background {
    position: absolute;
    top: 0;
    left: 0;
    pointer-events: none;
  }
  
  .canvas-content {
    position: absolute;
    top: 0;
    left: 0;
    will-change: transform;
    pointer-events: none;
  }
  
  .page {
    position: relative;
    box-shadow: 
      0 4px 6px -1px rgba(0, 0, 0, 0.1),
      0 2px 4px -1px rgba(0, 0, 0, 0.06),
      0 20px 25px -5px rgba(0, 0, 0, 0.1);
    border-radius: 2px;
    pointer-events: all;
  }
  
  .rulers {
    position: absolute;
    top: 0;
    left: 0;
    pointer-events: none;
  }
</style>

