<script lang="ts">
  import type { Block, SpacerBlockContent } from '$lib/types/blocks';
  
  export let block: Block;
  
  $: styles = block.styles;
</script>

<div
  class="spacer-block"
  style="
    background-color: {styles.background?.color || 'transparent'};
    border: {styles.border?.width || 0}px {styles.border?.style || 'dashed'} {styles.border?.color || '#cbd5e1'};
    border-radius: {styles.border?.radius || 0}px;
  "
  role="separator"
  aria-label="Spacer block"
>
  <div class="spacer-label">
    Spacer ({block.size.height}px)
  </div>
</div>

<style>
  .spacer-block {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    opacity: 0.5;
  }
  
  .spacer-label {
    font-size: 12px;
    color: #94a3b8;
    pointer-events: none;
  }
</style>

