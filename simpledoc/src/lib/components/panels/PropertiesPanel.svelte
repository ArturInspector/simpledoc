<script lang="ts">
  import { primarySelectedBlock, blocksActions, selectionActions } from '$lib/stores';
  import type { TextBlockContent } from '$lib/types/blocks';
  
  $: block = $primarySelectedBlock;
  $: hasSelection = block !== null;
  
  function handleDelete() {
    if (block) {
      blocksActions.remove(block.id);
    }
  }
  
  function handleDuplicate() {
    if (block) {
      blocksActions.duplicate(block.id);
    }
  }
  
  function handleLock() {
    if (block) {
      blocksActions.toggleLock(block.id);
    }
  }
  
  function handleBringForward() {
    if (block) {
      blocksActions.bringForward(block.id);
    }
  }
  
  function handleSendBackward() {
    if (block) {
      blocksActions.sendBackward(block.id);
    }
  }
  
  // Text-specific handlers
  function handleTextChange(field: keyof TextBlockContent, value: any) {
    if (block && block.type === 'text') {
      blocksActions.update(block.id, {
        content: { ...block.content, [field]: value }
      });
    }
  }
  
  // Position & Size handlers
  function handlePositionChange(axis: 'x' | 'y', value: number) {
    if (block) {
      blocksActions.move(block.id, {
        ...block.position,
        [axis]: value
      });
    }
  }
  
  function handleSizeChange(dimension: 'width' | 'height', value: number) {
    if (block) {
      blocksActions.resize(block.id, {
        ...block.size,
        [dimension]: Math.max(20, value)
      });
    }
  }
</script>

<div class="properties-panel">
  {#if hasSelection && block}
    <div class="panel-header">
      <h3 class="panel-title">Properties</h3>
      <div class="panel-actions">
        <button 
          class="action-btn" 
          on:click={handleDuplicate}
          aria-label="Duplicate"
          title="Duplicate"
        >
          📋
        </button>
        <button 
          class="action-btn" 
          on:click={handleDelete}
          aria-label="Delete"
          title="Delete"
        >
          🗑️
        </button>
      </div>
    </div>
    
    <div class="panel-content">
      <!-- Block Info -->
      <div class="property-section">
        <h4 class="section-title">Block Info</h4>
        <div class="property-row">
          <span class="property-label">Type</span>
          <span class="property-value">{block.type}</span>
        </div>
        <div class="property-row">
          <span class="property-label">ID</span>
          <span class="property-value mono">{block.id.slice(0, 8)}...</span>
        </div>
      </div>
      
      <!-- Position & Size -->
      <div class="property-section">
        <h4 class="section-title">Position & Size</h4>
        <div class="property-grid">
          <div class="property-field">
            <label for="pos-x">X</label>
            <input
              id="pos-x"
              type="number"
              value={Math.round(block.position.x)}
              on:change={(e) => handlePositionChange('x', Number(e.currentTarget.value))}
              class="input-number"
            />
          </div>
          <div class="property-field">
            <label for="pos-y">Y</label>
            <input
              id="pos-y"
              type="number"
              value={Math.round(block.position.y)}
              on:change={(e) => handlePositionChange('y', Number(e.currentTarget.value))}
              class="input-number"
            />
          </div>
          <div class="property-field">
            <label for="size-w">Width</label>
            <input
              id="size-w"
              type="number"
              value={Math.round(block.size.width)}
              on:change={(e) => handleSizeChange('width', Number(e.currentTarget.value))}
              class="input-number"
            />
          </div>
          <div class="property-field">
            <label for="size-h">Height</label>
            <input
              id="size-h"
              type="number"
              value={Math.round(block.size.height)}
              on:change={(e) => handleSizeChange('height', Number(e.currentTarget.value))}
              class="input-number"
            />
          </div>
        </div>
      </div>
      
      <!-- Text Properties (if text block) -->
      {#if block.type === 'text'}
        {@const textContent = block.content as TextBlockContent}
        <div class="property-section">
          <h4 class="section-title">Text Styles</h4>
          
          <div class="property-field">
            <label for="font-size">Font Size</label>
            <input
              id="font-size"
              type="number"
              value={textContent.fontSize}
              on:change={(e) => handleTextChange('fontSize', Number(e.currentTarget.value))}
              class="input-number"
              min="8"
              max="200"
            />
          </div>
          
          <div class="property-field">
            <label for="font-weight">Font Weight</label>
            <select
              id="font-weight"
              value={textContent.fontWeight}
              on:change={(e) => handleTextChange('fontWeight', Number(e.currentTarget.value))}
              class="input-select"
            >
              <option value="300">Light (300)</option>
              <option value="400">Regular (400)</option>
              <option value="500">Medium (500)</option>
              <option value="600">Semibold (600)</option>
              <option value="700">Bold (700)</option>
            </select>
          </div>
          
          <div class="property-field">
            <label for="text-align">Alignment</label>
            <select
              id="text-align"
              value={textContent.alignment}
              on:change={(e) => handleTextChange('alignment', e.currentTarget.value)}
              class="input-select"
            >
              <option value="left">Left</option>
              <option value="center">Center</option>
              <option value="right">Right</option>
              <option value="justify">Justify</option>
            </select>
          </div>
          
          <div class="property-field">
            <label for="text-color">Color</label>
            <input
              id="text-color"
              type="color"
              value={textContent.color}
              on:change={(e) => handleTextChange('color', e.currentTarget.value)}
              class="input-color"
            />
          </div>
        </div>
      {/if}
      
      <!-- Layer Controls -->
      <div class="property-section">
        <h4 class="section-title">Layer</h4>
        <div class="button-group">
          <button class="btn-secondary" on:click={handleBringForward}>
            ⬆️ Forward
          </button>
          <button class="btn-secondary" on:click={handleSendBackward}>
            ⬇️ Backward
          </button>
        </div>
        <div class="property-row">
          <label>
            <input
              type="checkbox"
              checked={block.locked}
              on:change={handleLock}
            />
            Lock block
          </label>
        </div>
      </div>
    </div>
  {:else}
    <div class="empty-state">
      <p class="empty-message">No block selected</p>
      <p class="empty-hint">Click on a block to edit its properties</p>
    </div>
  {/if}
</div>

<style>
  .properties-panel {
    height: 100%;
    display: flex;
    flex-direction: column;
    background: #f8fafc;
    border-left: 1px solid #e2e8f0;
  }
  
  .panel-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 16px;
    border-bottom: 1px solid #e2e8f0;
    background: #ffffff;
  }
  
  .panel-title {
    font-size: 16px;
    font-weight: 600;
    color: #0f172a;
    margin: 0;
  }
  
  .panel-actions {
    display: flex;
    gap: 4px;
  }
  
  .action-btn {
    width: 32px;
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: transparent;
    border: 1px solid #e2e8f0;
    border-radius: 4px;
    cursor: pointer;
    transition: all 150ms ease;
    font-size: 16px;
  }
  
  .action-btn:hover {
    background: #f1f5f9;
    border-color: #cbd5e1;
  }
  
  .panel-content {
    flex: 1;
    overflow-y: auto;
    padding: 16px;
  }
  
  .property-section {
    margin-bottom: 24px;
  }
  
  .section-title {
    font-size: 14px;
    font-weight: 600;
    color: #0f172a;
    margin: 0 0 12px 0;
  }
  
  .property-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 8px 0;
    font-size: 14px;
  }
  
  .property-label {
    color: #64748b;
    font-weight: 500;
  }
  
  .property-value {
    color: #0f172a;
  }
  
  .property-value.mono {
    font-family: 'Courier New', monospace;
    font-size: 12px;
  }
  
  .property-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 12px;
  }
  
  .property-field {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }
  
  .property-field label {
    font-size: 12px;
    font-weight: 500;
    color: #64748b;
  }
  
  .input-number,
  .input-select {
    padding: 6px 8px;
    font-size: 14px;
    border: 1px solid #cbd5e1;
    border-radius: 4px;
    background: #ffffff;
    color: #0f172a;
    transition: all 150ms ease;
  }
  
  .input-number:focus,
  .input-select:focus {
    outline: none;
    border-color: #0284c7;
    box-shadow: 0 0 0 3px rgba(2, 132, 199, 0.1);
  }
  
  .input-color {
    width: 100%;
    height: 36px;
    border: 1px solid #cbd5e1;
    border-radius: 4px;
    cursor: pointer;
  }
  
  .button-group {
    display: flex;
    gap: 8px;
    margin-bottom: 12px;
  }
  
  .btn-secondary {
    flex: 1;
    padding: 8px 12px;
    font-size: 14px;
    background: #ffffff;
    border: 1px solid #cbd5e1;
    border-radius: 4px;
    cursor: pointer;
    transition: all 150ms ease;
  }
  
  .btn-secondary:hover {
    background: #f1f5f9;
    border-color: #94a3b8;
  }
  
  .empty-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100%;
    text-align: center;
    padding: 32px;
  }
  
  .empty-message {
    font-size: 16px;
    font-weight: 500;
    color: #64748b;
    margin: 0 0 8px 0;
  }
  
  .empty-hint {
    font-size: 14px;
    color: #94a3b8;
    margin: 0;
  }
  
  /* Scrollbar */
  .panel-content::-webkit-scrollbar {
    width: 6px;
  }
  
  .panel-content::-webkit-scrollbar-track {
    background: transparent;
  }
  
  .panel-content::-webkit-scrollbar-thumb {
    background: #cbd5e1;
    border-radius: 3px;
  }
  
  .panel-content::-webkit-scrollbar-thumb:hover {
    background: #94a3b8;
  }
</style>

