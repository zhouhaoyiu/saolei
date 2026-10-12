<script setup lang="ts">
withDefaults(defineProps<{ name: string; size?: number }>(), { size: 20 })

const paths: Record<string, string> = {
  flag: 'M5 21V4m0 0c4-3 8 3 14 0v10c-6 3-10-3-14 0',
  clock: 'M12 8v5l3 2M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18',
  reset: 'M3 10a9 9 0 1 1 2 8M3 4v6h6',
  sun: 'M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8M12 2v2m0 16v2M2 12h2m16 0h2M5 5l1.5 1.5m11 11L19 19M5 19l1.5-1.5m11-11L19 5',
  moon: 'M20.5 14A8.5 8.5 0 0 1 10 3.5 8.5 8.5 0 1 0 20.5 14Z',
  mine: 'M12 6a6 6 0 1 0 0 12 6 6 0 0 0 0-12M12 2v2m0 16v2M2 12h2m16 0h2M5 5l1.5 1.5m11 11L19 19M5 19l1.5-1.5m11-11L19 5',
  reveal: 'M8 3H4a1 1 0 0 0-1 1v4m13-5h4a1 1 0 0 1 1 1v4M3 16v4a1 1 0 0 0 1 1h4m13-5v4a1 1 0 0 1-1 1h-4M9 12h6m-3-3v6',
  eye: 'M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Zm10-3a3 3 0 1 0 0 6 3 3 0 0 0 0-6',
  arrow: 'M7 17 17 7M7 7h10v10',
  check: 'm5 12 4 4L19 6',
  help: 'M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18M9.8 9a2.2 2.2 0 0 1 4.4 0c0 2-2.2 2-2.2 4m0 3h.01',
}
</script>

<template>
  <svg :width="size" :height="size" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
    <path :d="paths[name] || paths.mine" />
  </svg>
</template>
