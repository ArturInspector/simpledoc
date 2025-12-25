<script lang="ts">
  import { sidebarOpen, documents, currentDocument } from '$lib/stores/app';
  import Button from '$lib/components/ui/Button.svelte';
  
  function toggleSidebar() {
    sidebarOpen.update(open => !open);
  }
  
  function selectDocument(doc: typeof $documents[0]) {
    currentDocument.set(doc);
  }
</script>

{#if $sidebarOpen}
  <aside class="w-64 bg-white border-r border-office-ribbon-border flex flex-col">
    <!-- Sidebar header -->
    <div class="p-3 border-b border-office-ribbon-border flex items-center justify-between">
      <h2 class="text-sm font-semibold text-gray-800">Документы</h2>
      <button
        onclick={toggleSidebar}
        class="text-gray-500 hover:text-gray-700 transition-office"
        title="Закрыть панель"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
    
    <!-- Documents list -->
    <div class="flex-1 overflow-y-auto">
      {#if $documents.length === 0}
        <div class="p-4 text-center text-sm text-gray-500">
          Нет документов
        </div>
      {:else}
        <div class="p-2 space-y-1">
          {#each $documents as doc}
            <button
              onclick={() => selectDocument(doc)}
              class="w-full text-left px-3 py-2 text-sm rounded transition-office
                     {$currentDocument?.id === doc.id 
                       ? 'bg-office-ribbon-hover text-gray-900' 
                       : 'hover:bg-office-ribbon-hover text-gray-700'}"
            >
              <div class="font-medium truncate">{doc.title}</div>
              <div class="text-xs text-gray-500">
                {new Date(doc.updatedAt).toLocaleDateString('ru-RU')}
              </div>
            </button>
          {/each}
        </div>
      {/if}
    </div>
  </aside>
{:else}
  <button
    onclick={toggleSidebar}
    class="absolute left-0 top-header z-10 w-6 h-12 bg-white border-r border-b border-office-ribbon-border 
           hover:bg-office-ribbon-hover transition-office flex items-center justify-center"
    title="Открыть панель"
  >
    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
    </svg>
  </button>
{/if}

