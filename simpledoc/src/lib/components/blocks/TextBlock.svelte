<script lang="ts">
  import type { Block, TextBlockContent } from '$lib/types/blocks';
  import { blocksActions } from '$lib/stores';
  
  export let block: Block;
  export let onEditStart: (() => void) | undefined = undefined;
  export let onEditEnd: (() => void) | undefined = undefined;
  
  $: content = block.content as TextBlockContent;
  $: styles = block.styles;
  
  let isEditing = false;
  let textElement: HTMLDivElement;
  
  export function startEditing() {
    if (content.isEditable && !block.locked) {
      isEditing = true;
      onEditStart?.();
      setTimeout(() => {
        textElement?.focus();
        // Select all text
        const range = document.createRange();
        range.selectNodeContents(textElement);
        const selection = window.getSelection();
        selection?.removeAllRanges();
        selection?.addRange(range);
      }, 0);
    }
  }
  
  function handleDoubleClick(e: MouseEvent) {
    e.stopPropagation();
    startEditing();
  }
  
  function handleClick(e: MouseEvent) {
    if (isEditing) {
      e.stopPropagation();
    }
  }
  
  function handleBlur() {
    isEditing = false;
    onEditEnd?.();
    // Save content
    const newText = textElement?.innerText || '';
    if (newText !== content.text) {
      blocksActions.update(block.id, {
        content: { ...content, text: newText }
      });
    }
  }
  
  function handleKeyDown(e: KeyboardEvent) {
    if (isEditing) {
      e.stopPropagation(); // Prevent canvas shortcuts
      
      if (e.key === 'Escape') {
        e.preventDefault();
        isEditing = false;
        textElement?.blur();
      }
      
      // Allow Enter for line breaks
      if (e.key === 'Enter' && !e.shiftKey) {
        // Keep default behavior - insert line break
      }
    }
  }
  
  function handleInput() {
    // Auto-save on input
    const newText = textElement?.innerText || '';
    if (newText !== content.text) {
      blocksActions.update(block.id, {
        content: { ...content, text: newText }
      });
    }
  }
</script>

<div
  class="text-block"
  class:editing={isEditing}
  style="
    padding: {styles.padding?.top || 0}px {styles.padding?.right || 0}px {styles.padding?.bottom || 0}px {styles.padding?.left || 0}px;
    background-color: {styles.background?.color || 'transparent'};
    border: {styles.border?.width || 0}px {styles.border?.style || 'solid'} {styles.border?.color || '#000'};
    border-radius: {styles.border?.radius || 0}px;
  "
  on:dblclick={handleDoubleClick}
  on:click={handleClick}
  role="textbox"
  aria-label="Text block"
>
  <div
    bind:this={textElement}
    class="text-content"
    contenteditable={isEditing}
    on:blur={handleBlur}
    on:keydown={handleKeyDown}
    on:input={handleInput}
    style="
      font-family: {content.fontFamily};
      font-size: {content.fontSize}px;
      font-weight: {content.fontWeight};
      line-height: {content.lineHeight};
      letter-spacing: {content.letterSpacing}px;
      color: {content.color};
      text-align: {content.alignment};
      text-decoration: {content.textDecoration || 'none'};
      word-wrap: break-word;
      white-space: pre-wrap;
    "
  >
    {content.text}
  </div>
</div>

<style>
  .text-block {
    width: 100%;
    height: 100%;
    overflow: hidden;
    box-sizing: border-box;
  }
  
  .text-content {
    width: 100%;
    height: 100%;
    outline: none;
    cursor: text;
    overflow: auto;
  }
  
  .text-content:not([contenteditable="true"]) {
    cursor: default;
    pointer-events: none;
  }
  
  .text-content[contenteditable="true"] {
    pointer-events: all !important;
    background: rgba(255, 255, 255, 0.95);
    padding: 4px;
    border: 2px solid #3b82f6;
    border-radius: 4px;
    cursor: text !important;
  }
  
  .editing {
    z-index: 1000 !important;
  }
</style>

