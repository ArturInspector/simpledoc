<script lang="ts">
  import { activeRibbonTab, isRibbonCollapsed } from '$lib/stores/app';
  import { ribbonConfig, type RibbonTab } from '$lib/constants/ribbon';
  import Button from '$lib/components/ui/Button.svelte';
  
  let currentTab = $state<RibbonTab>('home');
  
  $effect(() => {
    currentTab = $activeRibbonTab;
  });
  
  function selectTab(tabId: RibbonTab) {
    activeRibbonTab.set(tabId);
  }
  
  function toggleRibbon() {
    isRibbonCollapsed.update(c => !c);
  }
  
  let activeConfig = $derived(ribbonConfig.find(tab => tab.id === currentTab));
</script>

<div class="ribbon-panel bg-office-ribbon-bg">
  <!-- Tab buttons -->
  <div class="flex items-end border-b border-office-ribbon-border">
    <div class="flex items-end gap-1 px-2">
      {#each ribbonConfig as tab}
        <button
          class="px-4 py-2 text-sm font-medium transition-office rounded-t
                 {$activeRibbonTab === tab.id 
                   ? 'bg-white text-gray-900 border-t border-l border-r border-office-ribbon-border' 
                   : 'text-gray-600 hover:text-gray-900 hover:bg-office-ribbon-hover'}"
          onclick={() => selectTab(tab.id)}
        >
          {tab.label}
        </button>
      {/each}
    </div>
    <button
      class="ml-auto px-2 py-2 text-gray-600 hover:bg-office-ribbon-hover transition-office"
      onclick={toggleRibbon}
      title="Свернуть/Развернуть ленту"
    >
      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 15l7-7 7 7" />
      </svg>
    </button>
  </div>
  
  <!-- Ribbon content -->
  {#if !$isRibbonCollapsed && activeConfig}
    <div class="bg-white px-3 py-2 border-b border-office-ribbon-border">
      <div class="flex items-start gap-6">
        {#each activeConfig.groups as group}
          <div class="flex flex-col gap-1.5">
            <div class="text-xs text-gray-500 font-medium mb-1">{group.label}</div>
            <div class="flex flex-wrap items-center gap-1.5">
              {#each group.items as item}
                <Button
                  variant={item.large ? 'primary' : 'default'}
                  large={item.large}
                  disabled={item.disabled}
                  onclick={item.action}
                  title={item.shortcut ? `${item.label} (${item.shortcut})` : item.label}
                >
                  {#if item.icon}
                    <span class="text-base">{item.icon}</span>
                  {/if}
                  {#if item.large}
                    <span class="text-xs">{item.label}</span>
                  {:else}
                    <span>{item.label}</span>
                  {/if}
                </Button>
              {/each}
            </div>
          </div>
          {#if !group.items[group.items.length - 1]}
            <div class="w-px h-16 bg-office-ribbon-border" />
          {/if}
        {/each}
      </div>
    </div>
  {/if}
</div>

