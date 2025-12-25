<script lang="ts">
  interface Props {
    variant?: 'default' | 'primary' | 'ghost';
    size?: 'sm' | 'md' | 'lg';
    disabled?: boolean;
    large?: boolean;
    onclick?: (e: MouseEvent) => void;
    children?: import('svelte').Snippet;
  }
  
  let {
    variant = 'default',
    size = 'md',
    disabled = false,
    large = false,
    onclick,
    children,
  }: Props = $props();
  
  let buttonClasses = $derived(() => {
    const base = 'transition-office font-medium rounded inline-flex items-center justify-center gap-1.5';
    const variants = {
      default: 'btn-office',
      primary: 'btn-office-primary',
      ghost: 'bg-transparent hover:bg-office-ribbon-hover border-transparent',
    };
    const sizes = {
      sm: 'px-2 py-1 text-xs',
      md: 'px-3 py-1.5 text-sm',
      lg: 'px-4 py-2 text-base',
    };
    const largeSize = large ? 'px-4 py-3 text-sm flex-col h-20 w-20' : '';
    
    return `${base} ${variants[variant]} ${large ? largeSize : sizes[size]} ${
      disabled ? 'opacity-50 cursor-not-allowed' : ''
    }`;
  });
</script>

<button
  class={buttonClasses()}
  {disabled}
  {onclick}
>
  {#if children}
    {@render children()}
  {/if}
</button>

