<script lang="ts">
  export let gridSize: number = 8;
  export let pageWidth: number;
  export let pageHeight: number;
  export let color: string = '#e2e8f0';
  export let opacity: number = 0.5;
  
  $: columns = Math.ceil(pageWidth / gridSize);
  $: rows = Math.ceil(pageHeight / gridSize);
</script>

<svg 
  class="grid" 
  width={pageWidth} 
  height={pageHeight}
  style="opacity: {opacity};"
  aria-hidden="true"
>
  <defs>
    <pattern
      id="grid-pattern"
      width={gridSize}
      height={gridSize}
      patternUnits="userSpaceOnUse"
    >
      <circle
        cx={gridSize / 2}
        cy={gridSize / 2}
        r="0.5"
        fill={color}
      />
    </pattern>
  </defs>
  
  <rect
    width={pageWidth}
    height={pageHeight}
    fill="url(#grid-pattern)"
  />
</svg>

<style>
  .grid {
    position: absolute;
    top: 0;
    left: 0;
    pointer-events: none;
    z-index: 0;
  }
</style>

