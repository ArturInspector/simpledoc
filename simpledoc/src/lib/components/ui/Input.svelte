<script lang="ts">
  import { generateId } from '$lib/utils';
  
  interface Props {
    label?: string;
    type?: string;
    placeholder?: string;
    value?: string;
    error?: string;
    disabled?: boolean;
  }
  
  let {
    label,
    type = 'text',
    placeholder = '',
    value = $bindable(''),
    error,
    disabled = false,
  }: Props = $props();
  
  const inputId = $state(generateId());
</script>

<div class="flex flex-col gap-1">
  {#if label}
    <label for={inputId} class="text-sm font-medium text-gray-700">
      {label}
    </label>
  {/if}
  <input
    id={inputId}
    type={type}
    {placeholder}
    bind:value
    {disabled}
    class="input-office {error ? 'border-red-500' : ''}"
  />
  {#if error}
    <span class="text-xs text-red-600">{error}</span>
  {/if}
</div>

