<script lang="ts">
  import type { Block } from '$lib/types/blocks';
  import { selection, dragState, resizeState, blocksActions, dragActions, resizeActions, selectionActions, canvasStore } from '$lib/stores';
  import { get } from 'svelte/store';
  import TextBlock from '../blocks/TextBlock.svelte';
  import ImageBlock from '../blocks/ImageBlock.svelte';
  import TableBlock from '../blocks/TableBlock.svelte';
  import SpacerBlock from '../blocks/SpacerBlock.svelte';
  
  export let block: Block;
  
  let textBlockRef: any;
  let isTextEditing = false;
  
  $: isSelected = $selection.blockIds.includes(block.id);
  $: isDragging = $dragState.isDragging && $dragState.blockId === block.id;
  $: isResizing = $resizeState.isResizing && $resizeState.blockId === block.id;
  
  // ============================================================================
  // Interaction Handlers
  // ============================================================================
  
  function handleMouseDown(e: MouseEvent) {
    if (block.locked || isTextEditing) return;
    
    // Если кликнули на contenteditable элемент, не начинаем drag
    const target = e.target as HTMLElement;
    if (target.contentEditable === 'true' || target.closest('[contenteditable="true"]')) {
      return;
    }
    
    e.stopPropagation();
    e.preventDefault();
    
    // Select block
    if (e.ctrlKey || e.metaKey) {
      // Multi-select
      if (isSelected) {
        selectionActions.remove(block.id);
      } else {
        selectionActions.add(block.id);
      }
    } else {
      if (!isSelected) {
        selectionActions.select(block.id);
      }
    }
    
    // Start dragging
    // Вычисляем offset - смещение курсора относительно левого верхнего угла блока
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const offsetX = e.clientX - rect.left;
    const offsetY = e.clientY - rect.top;
    
    // Но нам нужен offset в canvas координатах (без учета zoom)
    const canvasState = get(canvasStore);
    const zoom = canvasState.config.zoom;
    
    dragActions.start(
      block.id, 
      { x: offsetX / zoom, y: offsetY / zoom }, // offset в canvas координатах
      block.position
    );
  }
  
  function handleDoubleClick(e: MouseEvent) {
    e.stopPropagation();
    e.preventDefault();
    
    if (block.type === 'text' && textBlockRef) {
      textBlockRef.startEditing();
    }
  }
  
  function handleEditStart() {
    isTextEditing = true;
  }
  
  function handleEditEnd() {
    isTextEditing = false;
  }
  
  // Handle resize handle mousedown
  function handleResizeMouseDown(e: MouseEvent, handle: string) {
    e.stopPropagation();
    e.preventDefault();
    
    if (block.locked) return;
    
    resizeActions.start(block.id, handle as any, block);
  }
</script>

<div
  class="block-wrapper"
  class:selected={isSelected}
  class:dragging={isDragging}
  class:locked={block.locked}
  style="
    position: absolute;
    left: {block.position.x}px;
    top: {block.position.y}px;
    width: {block.size.width}px;
    height: {block.size.height}px;
    z-index: {block.zIndex};
    transform: rotate({block.transform.rotation}deg) scale({block.transform.scaleX}, {block.transform.scaleY});
    cursor: {block.locked ? 'not-allowed' : 'move'};
  "
  on:mousedown={handleMouseDown}
  on:dblclick={handleDoubleClick}
  role="button"
  tabindex="0"
  aria-label="Block {block.type}"
>
  <!-- Block Content by Type -->
  <div class="block-content">
    {#if block.type === 'text'}
      <TextBlock 
        {block} 
        bind:this={textBlockRef}
        onEditStart={handleEditStart}
        onEditEnd={handleEditEnd}
      />
    {:else if block.type === 'image'}
      <ImageBlock {block} />
    {:else if block.type === 'table'}
      <TableBlock {block} />
    {:else if block.type === 'spacer'}
      <SpacerBlock {block} />
    {/if}
  </div>
  
  <!-- Selection Handles (visible when selected) -->
  {#if isSelected && !block.locked}
    <div class="selection-handles">
      <!-- Resize handles -->
      <div class="handle handle-tl" data-handle="top-left" on:mousedown={(e) => handleResizeMouseDown(e, 'top-left')}></div>
      <div class="handle handle-tr" data-handle="top-right" on:mousedown={(e) => handleResizeMouseDown(e, 'top-right')}></div>
      <div class="handle handle-bl" data-handle="bottom-left" on:mousedown={(e) => handleResizeMouseDown(e, 'bottom-left')}></div>
      <div class="handle handle-br" data-handle="bottom-right" on:mousedown={(e) => handleResizeMouseDown(e, 'bottom-right')}></div>
      <div class="handle handle-t" data-handle="top" on:mousedown={(e) => handleResizeMouseDown(e, 'top')}></div>
      <div class="handle handle-r" data-handle="right" on:mousedown={(e) => handleResizeMouseDown(e, 'right')}></div>
      <div class="handle handle-b" data-handle="bottom" on:mousedown={(e) => handleResizeMouseDown(e, 'bottom')}></div>
      <div class="handle handle-l" data-handle="left" on:mousedown={(e) => handleResizeMouseDown(e, 'left')}></div>
    </div>
  {/if}
</div>

<style>
  .block-wrapper {
    box-sizing: border-box;
    transition: box-shadow 150ms ease;
  }
  
  .block-wrapper:hover:not(.locked) {
    box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.3);
  }
  
  .block-wrapper.selected {
    box-shadow: 0 0 0 2px #3b82f6;
  }
  
  .block-wrapper.dragging {
    opacity: 0.7;
    cursor: grabbing !important;
  }
  
  .block-wrapper.locked {
    opacity: 0.6;
  }
  
  .block-content {
    width: 100%;
    height: 100%;
    overflow: hidden;
    pointer-events: none;
  }
  
  /* Selection Handles */
  .selection-handles {
    position: absolute;
    top: -4px;
    left: -4px;
    right: -4px;
    bottom: -4px;
    pointer-events: none;
  }
  
  .handle {
    position: absolute;
    width: 8px;
    height: 8px;
    background: #ffffff;
    border: 2px solid #3b82f6;
    border-radius: 2px;
    pointer-events: all;
    z-index: 10;
  }
  
  .handle:hover {
    background: #3b82f6;
    transform: scale(1.2);
  }
  
  /* Corner handles */
  .handle-tl {
    top: 0;
    left: 0;
    cursor: nwse-resize;
  }
  
  .handle-tr {
    top: 0;
    right: 0;
    cursor: nesw-resize;
  }
  
  .handle-bl {
    bottom: 0;
    left: 0;
    cursor: nesw-resize;
  }
  
  .handle-br {
    bottom: 0;
    right: 0;
    cursor: nwse-resize;
  }
  
  /* Edge handles */
  .handle-t {
    top: 0;
    left: 50%;
    transform: translateX(-50%);
    cursor: ns-resize;
  }
  
  .handle-r {
    right: 0;
    top: 50%;
    transform: translateY(-50%);
    cursor: ew-resize;
  }
  
  .handle-b {
    bottom: 0;
    left: 50%;
    transform: translateX(-50%);
    cursor: ns-resize;
  }
  
  .handle-l {
    left: 0;
    top: 50%;
    transform: translateY(-50%);
    cursor: ew-resize;
  }
</style>

