<script lang="ts">
  import { ui, uiActions, canvasStore, documentActions } from '$lib/stores';
  import Canvas from '$lib/components/canvas/Canvas.svelte';
  import BlockLibrary from '$lib/components/panels/BlockLibrary.svelte';
  import PropertiesPanel from '$lib/components/panels/PropertiesPanel.svelte';
  import Toolbar from './Toolbar.svelte';
  
  $: leftPanelOpen = $ui.leftPanelOpen;
  $: leftPanelWidth = $ui.leftPanelWidth;
  $: rightPanelOpen = $ui.rightPanelOpen;
  $: rightPanelWidth = $ui.rightPanelWidth;
  
  // Keyboard shortcuts
  function handleKeyDown(e: KeyboardEvent) {
    // Ctrl/Cmd + B = Toggle left panel
    if ((e.ctrlKey || e.metaKey) && e.key === 'b') {
      e.preventDefault();
      uiActions.toggleLeftPanel();
    }
    
    // Ctrl/Cmd + P = Toggle right panel
    if ((e.ctrlKey || e.metaKey) && e.key === 'p') {
      e.preventDefault();
      uiActions.toggleRightPanel();
    }
    
    // Ctrl/Cmd + 0 = Reset zoom
    if ((e.ctrlKey || e.metaKey) && e.key === '0') {
      e.preventDefault();
      canvasStore.resetZoom();
    }
    
    // Ctrl/Cmd + = = Zoom in
    if ((e.ctrlKey || e.metaKey) && e.key === '=') {
      e.preventDefault();
      canvasStore.zoomIn();
    }
    
    // Ctrl/Cmd + - = Zoom out
    if ((e.ctrlKey || e.metaKey) && e.key === '-') {
      e.preventDefault();
      canvasStore.zoomOut();
    }
    
    // Ctrl/Cmd + G = Toggle grid
    if ((e.ctrlKey || e.metaKey) && e.key === 'g') {
      e.preventDefault();
      canvasStore.toggleGrid();
    }
  }
</script>

<svelte:window on:keydown={handleKeyDown} />

<div class="editor-layout">
  <!-- Toolbar -->
  <div class="toolbar-container">
    <Toolbar />
  </div>
  
  <!-- Main Content -->
  <div class="editor-content">
    <!-- Left Panel (Block Library) -->
    {#if leftPanelOpen}
      <aside 
        class="left-panel"
        style="width: {leftPanelWidth}px;"
        role="complementary"
        aria-label="Block Library Panel"
      >
        <BlockLibrary />
      </aside>
    {/if}
    
    <!-- Canvas Area -->
    <main class="canvas-area" role="main">
      <Canvas />
    </main>
    
    <!-- Right Panel (Properties) -->
    {#if rightPanelOpen}
      <aside 
        class="right-panel"
        style="width: {rightPanelWidth}px;"
        role="complementary"
        aria-label="Properties Panel"
      >
        <PropertiesPanel />
      </aside>
    {/if}
  </div>
</div>

<style>
  .editor-layout {
    display: flex;
    flex-direction: column;
    height: 100vh;
    width: 100vw;
    overflow: hidden;
    background: #ffffff;
  }
  
  .toolbar-container {
    flex-shrink: 0;
    border-bottom: 1px solid #e2e8f0;
    background: #ffffff;
    z-index: 100;
  }
  
  .editor-content {
    flex: 1;
    display: flex;
    overflow: hidden;
    min-height: 0;
  }
  
  .left-panel {
    flex-shrink: 0;
    height: 100%;
    overflow: hidden;
  }
  
  .right-panel {
    flex-shrink: 0;
    height: 100%;
    overflow: hidden;
  }
  
  .canvas-area {
    flex: 1;
    height: 100%;
    overflow: hidden;
    min-width: 0;
  }
</style>

