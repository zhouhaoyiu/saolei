<script setup lang="ts">
defineProps<{ value: string; label: string }>()

const segments: Record<string, string> = {
  0: 'abcedf', 1: 'bc', 2: 'abged', 3: 'abgcd', 4: 'fgbc',
  5: 'afgcd', 6: 'afgecd', 7: 'abc', 8: 'abcdefg', 9: 'abfgcd', '-': 'g',
}
const paths: Record<string, string> = {
  a: 'M3 1H15L12 4H6Z',
  b: 'M16 2V14L13 12V5Z',
  c: 'M16 16V28L13 25V18Z',
  d: 'M3 29H15L12 26H6Z',
  e: 'M2 16V28L5 25V18Z',
  f: 'M2 2V14L5 12V5Z',
  g: 'M3 15L6 13H12L15 15L12 17H6Z',
}
</script>

<template>
  <div class="led-display" role="img" :aria-label="label">
    <svg v-for="char, index in value" :key="index" :viewBox="char === ':' ? '0 0 7 30' : '0 0 18 30'" :class="{ colon: char === ':' }" aria-hidden="true">
      <template v-if="char === ':'"><path class="lit" d="M2 8H5V11H2ZM2 20H5V23H2Z" /></template>
      <template v-else><path v-for="path, segment in paths" :key="segment" :d="path" :class="{ lit: segments[char]?.includes(segment) }" /></template>
    </svg>
  </div>
</template>
