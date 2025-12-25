<script lang="ts">
  export let padding: 'none' | 'sm' | 'md' | 'lg' = 'md';
  
  let paddingClasses = $derived(() => {
    const classes = {
      none: '',
      sm: 'p-2',
      md: 'p-4',
      lg: 'p-6',
    };
    return classes[padding];
  });
</script>

<div class="panel-office {paddingClasses()}">
  <slot />
</div>

