<script lang="ts">
  import { notification } from '$lib/stores/app';
  
  $effect(() => {
    if ($notification) {
      const timer = setTimeout(() => {
        notification.set(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  });
</script>

{#if $notification}
  <div
    class="fixed top-4 right-4 z-50 px-4 py-3 rounded shadow-office-lg flex items-center gap-2
           {$notification.type === 'error' 
             ? 'bg-red-50 border border-red-200 text-red-800' 
             : $notification.type === 'success' 
             ? 'bg-green-50 border border-green-200 text-green-800'
             : 'bg-blue-50 border border-blue-200 text-blue-800'}"
    role="alert"
  >
    <span class="text-sm font-medium">{$notification.message}</span>
    <button
      onclick={() => notification.set(null)}
      class="ml-2 text-current opacity-70 hover:opacity-100"
    >
      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
      </svg>
    </button>
  </div>
{/if}

