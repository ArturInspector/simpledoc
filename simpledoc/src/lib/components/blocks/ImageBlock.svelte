<script lang="ts">
  import type { Block, ImageBlockContent } from '$lib/types/blocks';
  
  export let block: Block;
  
  $: content = block.content as ImageBlockContent;
  $: styles = block.styles;
  $: filters = content.filters;
</script>

<div
  class="image-block"
  style="
    padding: {styles.padding?.top || 0}px {styles.padding?.right || 0}px {styles.padding?.bottom || 0}px {styles.padding?.left || 0}px;
    background-color: {styles.background?.color || 'transparent'};
    border: {styles.border?.width || 0}px {styles.border?.style || 'solid'} {styles.border?.color || '#000'};
    border-radius: {styles.border?.radius || 0}px;
  "
  role="img"
  aria-label={content.alt}
>
  {#if content.src}
    <img
      src={content.src}
      alt={content.alt}
      class="image-content"
      style="
        object-fit: {content.objectFit};
        opacity: {content.opacity};
        filter: 
          brightness({filters?.brightness || 100}%) 
          contrast({filters?.contrast || 100}%) 
          saturate({filters?.saturation || 100}%) 
          blur({filters?.blur || 0}px);
      "
    />
  {:else}
    <div class="image-placeholder">
      <svg width="64" height="64" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M4 16L8.586 11.414C9.367 10.633 10.633 10.633 11.414 11.414L16 16M14 14L15.586 12.414C16.367 11.633 17.633 11.633 18.414 12.414L20 14M14 8H14.01M6 20H18C19.105 20 20 19.105 20 18V6C20 4.895 19.105 4 18 4H6C4.895 4 4 4.895 4 6V18C4 19.105 4.895 20 6 20Z" stroke="#94a3b8" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
      <p>No Image</p>
    </div>
  {/if}
</div>

<style>
  .image-block {
    width: 100%;
    height: 100%;
    overflow: hidden;
    box-sizing: border-box;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  .image-content {
    width: 100%;
    height: 100%;
    display: block;
  }
  
  .image-placeholder {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 8px;
    color: #94a3b8;
    font-size: 14px;
    text-align: center;
  }
</style>

