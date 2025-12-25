<script lang="ts">
  import { getCurrentWindow } from '@tauri-apps/api/window';
  import { invoke } from '@tauri-apps/api/core';
  
  let appName = 'SimpleDoc';
  let isTauri = $state(false);
  
  $effect(() => {
    // Проверяем, запущено ли в Tauri
    if (typeof window !== 'undefined' && '__TAURI_INTERNALS__' in window) {
      isTauri = true;
    }
  });
  
  async function minimize() {
    if (!isTauri) return;
    try {
      const window = getCurrentWindow();
      await window.minimize();
    } catch (e) {
      console.warn('Window controls not available:', e);
    }
  }
  
  async function maximize() {
    if (!isTauri) return;
    try {
      const window = getCurrentWindow();
      const isMaximized = await window.isMaximized();
      if (isMaximized) {
        await window.unmaximize();
      } else {
        await window.maximize();
      }
    } catch (e) {
      console.warn('Window controls not available:', e);
    }
  }
  
  async function close() {
    if (!isTauri) return;
    try {
      const window = getCurrentWindow();
      await window.close();
    } catch (e) {
      console.warn('Window controls not available:', e);
    }
  }
</script>

<div class="ribbon-panel h-header flex items-center justify-between px-2 bg-white border-b border-office-ribbon-border">
  <div class="flex items-center gap-2 flex-1">
    <div class="flex items-center gap-2 px-2">
      <span class="text-sm font-semibold text-gray-800">{appName}</span>
    </div>
    <!-- Здесь можно добавить меню File, Edit и т.д. -->
  </div>
  
  <!-- Window controls (для десктопного приложения) -->
  {#if isTauri}
  <div class="flex items-center">
    <button
      onclick={minimize}
      class="w-10 h-header hover:bg-office-ribbon-hover transition-office flex items-center justify-center text-gray-600 hover:text-gray-900"
      title="Свернуть"
    >
      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4" />
      </svg>
    </button>
    <button
      onclick={maximize}
      class="w-10 h-header hover:bg-office-ribbon-hover transition-office flex items-center justify-center text-gray-600 hover:text-gray-900"
      title="Развернуть"
    >
      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
      </svg>
    </button>
    <button
      onclick={close}
      class="w-10 h-header hover:bg-red-500 hover:text-white transition-office flex items-center justify-center text-gray-600 hover:text-gray-900"
      title="Закрыть"
    >
      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
      </svg>
    </button>
  </div>
  {/if}
</div>

