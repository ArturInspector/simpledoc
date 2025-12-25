<script lang="ts">
  import { onMount } from 'svelte';
  import EditorLayout from '$lib/components/editor/EditorLayout.svelte';
  import { documentActions } from '$lib/stores';
  
  onMount(() => {
    // Создаём новый документ при запуске
    documentActions.create('Untitled Document');
  });
</script>

<EditorLayout />

<style>
  :global(body) {
    margin: 0;
    padding: 0;
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }
  
  :global(*) {
    box-sizing: border-box;
  }
  
  :global(button) {
    font-family: inherit;
  }
</style>
