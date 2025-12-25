<script lang="ts">
  import AppHeader from './AppHeader.svelte';
  import Ribbon from './Ribbon.svelte';
  import Sidebar from './Sidebar.svelte';
  import Notification from '$lib/components/ui/Notification.svelte';
  import { sidebarOpen, isRibbonCollapsed } from '$lib/stores/app';
</script>

<div class="flex flex-col h-screen overflow-hidden">
  <AppHeader />
  <Ribbon />
  
  <div class="flex flex-1 overflow-hidden relative">
    <Sidebar />
    
    <main class="flex-1 overflow-auto bg-white">
      <div class="min-h-full p-6">
        <slot />
      </div>
    </main>
  </div>
  
  <Notification />
</div>

<style>
  /* Убираем дефолтные стили для приложения */
  :global(body) {
    margin: 0;
    padding: 0;
    overflow: hidden;
  }
</style>

