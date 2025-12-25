<script lang="ts">
  import type { Block, TableBlockContent, TableCell } from '$lib/types/blocks';
  import { blocksActions } from '$lib/stores';
  
  export let block: Block;
  
  $: content = block.content as TableBlockContent;
  $: styles = block.styles;
  
  function handleCellInput(rowIndex: number, colIndex: number, e: Event) {
    const target = e.target as HTMLDivElement;
    const newContent = target.innerText;
    
    const updatedCells = [...content.cells];
    updatedCells[rowIndex][colIndex] = {
      ...updatedCells[rowIndex][colIndex],
      content: newContent
    };
    
    blocksActions.update(block.id, {
      content: { ...content, cells: updatedCells }
    });
  }
</script>

<div
  class="table-block"
  style="
    padding: {styles.padding?.top || 0}px {styles.padding?.right || 0}px {styles.padding?.bottom || 0}px {styles.padding?.left || 0}px;
    background-color: {styles.background?.color || 'transparent'};
    border: {styles.border?.width || 0}px {styles.border?.style || 'solid'} {styles.border?.color || '#000'};
    border-radius: {styles.border?.radius || 0}px;
  "
  role="table"
>
  <table class="table-content" style="border-collapse: collapse; width: 100%; height: 100%;">
    <tbody>
      {#each content.cells as row, rowIndex}
        <tr style="height: {content.rowHeights[rowIndex]}px;">
          {#each row as cell, colIndex}
            <td
              contenteditable="true"
              on:blur={(e) => handleCellInput(rowIndex, colIndex, e)}
              style="
                width: {content.columnWidths[colIndex]}px;
                text-align: {cell.alignment};
                background-color: {cell.backgroundColor || '#ffffff'};
                color: {cell.textColor || '#1e293b'};
                font-size: {cell.fontSize || 14}px;
                font-weight: {cell.fontWeight || 400};
                padding: {content.cellPadding}px;
                border: {content.borderWidth}px solid {content.borderColor};
                vertical-align: top;
              "
              colspan={cell.colspan}
              rowspan={cell.rowspan}
            >
              {cell.content}
            </td>
          {/each}
        </tr>
      {/each}
    </tbody>
  </table>
</div>

<style>
  .table-block {
    width: 100%;
    height: 100%;
    overflow: auto;
    box-sizing: border-box;
  }
  
  .table-content {
    min-width: 100%;
    min-height: 100%;
  }
  
  td {
    outline: none;
    cursor: text;
  }
  
  td:focus {
    background-color: rgba(59, 130, 246, 0.05) !important;
    box-shadow: inset 0 0 0 2px rgba(59, 130, 246, 0.5);
  }
</style>

