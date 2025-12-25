<script lang="ts">
  import { blocksActions } from '$lib/stores';
  import { 
    createTextBlock, 
    createHeadingBlock,
    createParagraphBlock,
    createImageBlock, 
    createTableBlock, 
    createSpacerBlock 
  } from '$lib/utils/blockFactory';
  
  interface BlockTemplate {
    id: string;
    name: string;
    icon: string;
    description: string;
    factory: () => void;
  }
  
  const blockTemplates: BlockTemplate[] = [
    {
      id: 'heading-1',
      name: 'Heading 1',
      icon: '📝',
      description: 'Large heading',
      factory: () => blocksActions.add(createHeadingBlock('Heading 1', 1))
    },
    {
      id: 'heading-2',
      name: 'Heading 2',
      icon: '📝',
      description: 'Medium heading',
      factory: () => blocksActions.add(createHeadingBlock('Heading 2', 2))
    },
    {
      id: 'heading-3',
      name: 'Heading 3',
      icon: '📝',
      description: 'Small heading',
      factory: () => blocksActions.add(createHeadingBlock('Heading 3', 3))
    },
    {
      id: 'paragraph',
      name: 'Paragraph',
      icon: '📄',
      description: 'Text paragraph',
      factory: () => blocksActions.add(createParagraphBlock())
    },
    {
      id: 'text',
      name: 'Text',
      icon: '✏️',
      description: 'Basic text block',
      factory: () => blocksActions.add(createTextBlock())
    },
    {
      id: 'image',
      name: 'Image',
      icon: '🖼️',
      description: 'Image block',
      factory: () => blocksActions.add(createImageBlock())
    },
    {
      id: 'table',
      name: 'Table',
      icon: '📊',
      description: '3×3 table',
      factory: () => blocksActions.add(createTableBlock(3, 3))
    },
    {
      id: 'spacer',
      name: 'Spacer',
      icon: '➖',
      description: 'Vertical space',
      factory: () => blocksActions.add(createSpacerBlock())
    }
  ];
  
  function handleBlockClick(template: BlockTemplate) {
    template.factory();
  }
</script>

<div class="block-library">
  <div class="library-header">
    <h3 class="library-title">Block Library</h3>
    <p class="library-subtitle">Click to add blocks</p>
  </div>
  
  <div class="library-content">
    <div class="block-grid">
      {#each blockTemplates as template (template.id)}
        <button
          class="block-item"
          on:click={() => handleBlockClick(template)}
          type="button"
          aria-label="Add {template.name}"
        >
          <div class="block-icon">{template.icon}</div>
          <div class="block-info">
            <div class="block-name">{template.name}</div>
            <div class="block-desc">{template.description}</div>
          </div>
        </button>
      {/each}
    </div>
  </div>
</div>

<style>
  .block-library {
    height: 100%;
    display: flex;
    flex-direction: column;
    background: #f8fafc;
    border-right: 1px solid #e2e8f0;
  }
  
  .library-header {
    padding: 16px;
    border-bottom: 1px solid #e2e8f0;
    background: #ffffff;
  }
  
  .library-title {
    font-size: 16px;
    font-weight: 600;
    color: #0f172a;
    margin: 0 0 4px 0;
  }
  
  .library-subtitle {
    font-size: 12px;
    color: #64748b;
    margin: 0;
  }
  
  .library-content {
    flex: 1;
    overflow-y: auto;
    padding: 16px;
  }
  
  .block-grid {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }
  
  .block-item {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 12px;
    background: #ffffff;
    border: 1px solid #e2e8f0;
    border-radius: 6px;
    cursor: pointer;
    transition: all 150ms ease;
    text-align: left;
    width: 100%;
  }
  
  .block-item:hover {
    border-color: #0284c7;
    background: #f0f9ff;
    transform: translateX(2px);
  }
  
  .block-item:active {
    transform: translateX(2px) scale(0.98);
  }
  
  .block-icon {
    font-size: 24px;
    flex-shrink: 0;
  }
  
  .block-info {
    flex: 1;
    min-width: 0;
  }
  
  .block-name {
    font-size: 14px;
    font-weight: 500;
    color: #0f172a;
    margin-bottom: 2px;
  }
  
  .block-desc {
    font-size: 12px;
    color: #64748b;
  }
  
  /* Scrollbar */
  .library-content::-webkit-scrollbar {
    width: 6px;
  }
  
  .library-content::-webkit-scrollbar-track {
    background: transparent;
  }
  
  .library-content::-webkit-scrollbar-thumb {
    background: #cbd5e1;
    border-radius: 3px;
  }
  
  .library-content::-webkit-scrollbar-thumb:hover {
    background: #94a3b8;
  }
</style>

