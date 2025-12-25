<script lang="ts">
  import { selection } from '$lib/stores';
  import { get } from 'svelte/store';
  
  $: selectedBlockIds = $selection.blockIds;
  $: hasSelection = selectedBlockIds.length > 0;
  
  // TODO: Draw selection box around multiple blocks
</script>

{#if hasSelection}
  <div class="selection-box">
    <!-- Selection box will be calculated based on selected blocks bounds -->
  </div>
{/if}

<style>
  .selection-box {
    position: absolute;
    border: 2px dashed #3b82f6;
    background: rgba(59, 130, 246, 0.05);
    pointer-events: none;
    z-index: 999;
  }
</style>

