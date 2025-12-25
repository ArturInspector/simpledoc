<script lang="ts">
  import { canvasStore, documentActions, documentTitle, canSave, ui, uiActions } from '$lib/stores';
  
  $: zoom = $canvasStore.config.zoom;
  $: title = $documentTitle;
  $: canSaveDoc = $canSave;
  
  function handleZoomIn() {
    canvasStore.zoomIn();
  }
  
  function handleZoomOut() {
    canvasStore.zoomOut();
  }
  
  function handleZoomReset() {
    canvasStore.resetZoom();
  }
  
  function handleToggleGrid() {
    canvasStore.toggleGrid();
  }
  
  function handleSave() {
    documentActions.save();
    uiActions.showNotification('success', 'Document saved!');
  }
  
  function handleExport() {
    uiActions.showNotification('info', 'Export feature coming soon!');
  }
  
  function handleNew() {
    documentActions.create();
    uiActions.showNotification('success', 'New document created!');
  }
</script>

<div class="toolbar">
  <div class="toolbar-section">
    <div class="doc-title">
      <h1 class="title-text">{title}</h1>
    </div>
  </div>
  
  <div class="toolbar-section toolbar-center">
    <!-- File Actions -->
    <div class="button-group">
      <button class="toolbar-btn" on:click={handleNew} title="New Document (Ctrl+N)">
        <span class="btn-icon">📄</span>
        <span class="btn-label">New</span>
      </button>
      
      <button 
        class="toolbar-btn" 
        on:click={handleSave} 
        disabled={!canSaveDoc}
        title="Save Document (Ctrl+S)"
      >
        <span class="btn-icon">💾</span>
        <span class="btn-label">Save</span>
      </button>
      
      <button class="toolbar-btn" on:click={handleExport} title="Export Document (Ctrl+E)">
        <span class="btn-icon">📥</span>
        <span class="btn-label">Export</span>
      </button>
    </div>
    
    <div class="toolbar-divider"></div>
    
    <!-- View Controls -->
    <div class="button-group">
      <button class="toolbar-btn" on:click={handleToggleGrid} title="Toggle Grid (Ctrl+G)">
        <span class="btn-icon">⊞</span>
      </button>
      
      <button class="toolbar-btn" on:click={() => canvasStore.toggleRulers()} title="Toggle Rulers (Ctrl+R)">
        <span class="btn-icon">📏</span>
      </button>
    </div>
    
    <div class="toolbar-divider"></div>
    
    <!-- Zoom Controls -->
    <div class="button-group">
      <button class="toolbar-btn" on:click={handleZoomOut} title="Zoom Out (Ctrl+-)">
        <span class="btn-icon">−</span>
      </button>
      
      <button class="toolbar-btn zoom-display" on:click={handleZoomReset} title="Reset Zoom (Ctrl+0)">
        <span class="zoom-value">{Math.round(zoom * 100)}%</span>
      </button>
      
      <button class="toolbar-btn" on:click={handleZoomIn} title="Zoom In (Ctrl+=)">
        <span class="btn-icon">+</span>
      </button>
    </div>
  </div>
  
  <div class="toolbar-section">
    <button 
      class="toolbar-btn" 
      on:click={() => uiActions.toggleLeftPanel()}
      title="Toggle Block Panel (Ctrl+B)"
    >
      <span class="btn-icon">◧</span>
    </button>
    
    <button 
      class="toolbar-btn" 
      on:click={() => uiActions.toggleRightPanel()}
      title="Toggle Properties Panel (Ctrl+P)"
    >
      <span class="btn-icon">◨</span>
    </button>
  </div>
</div>

<style>
  .toolbar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 56px;
    padding: 0 16px;
    gap: 16px;
  }
  
  .toolbar-section {
    display: flex;
    align-items: center;
    gap: 8px;
  }
  
  .toolbar-center {
    flex: 1;
    justify-content: center;
  }
  
  .doc-title {
    display: flex;
    align-items: center;
  }
  
  .title-text {
    font-size: 16px;
    font-weight: 600;
    color: #0f172a;
    margin: 0;
  }
  
  .button-group {
    display: flex;
    align-items: center;
    gap: 4px;
  }
  
  .toolbar-btn {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 8px 12px;
    background: #ffffff;
    border: 1px solid #e2e8f0;
    border-radius: 6px;
    cursor: pointer;
    transition: all 150ms ease;
    font-size: 14px;
    color: #0f172a;
    font-family: inherit;
  }
  
  .toolbar-btn:hover:not(:disabled) {
    background: #f8fafc;
    border-color: #cbd5e1;
  }
  
  .toolbar-btn:active:not(:disabled) {
    transform: scale(0.98);
  }
  
  .toolbar-btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
  
  .btn-icon {
    font-size: 18px;
    line-height: 1;
  }
  
  .btn-label {
    font-weight: 500;
  }
  
  .zoom-display {
    min-width: 70px;
    justify-content: center;
  }
  
  .zoom-value {
    font-weight: 600;
    font-variant-numeric: tabular-nums;
  }
  
  .toolbar-divider {
    width: 1px;
    height: 24px;
    background: #e2e8f0;
    margin: 0 4px;
  }
</style>

