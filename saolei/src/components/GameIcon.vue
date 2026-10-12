<script setup lang="ts">
withDefaults(defineProps<{ name: string; size?: number }>(), { size: 20 })
</script>

<template>
  <svg :width="size" :height="size" viewBox="0 0 24 24" aria-hidden="true">
    <template v-if="name.startsWith('face')">
      <circle cx="12" cy="12" r="10" fill="#ffde39" stroke="#242424" stroke-width="1.3" />
      <template v-if="name === 'face-lost'"><path d="m7 7 3 3m-3 0 3-3m4 0 3 3m-3 0 3-3M7.5 17q4.5-5 9 0" stroke="#242424" stroke-width="1.6" fill="none" /></template>
      <template v-else>
        <path v-if="name === 'face-won'" d="M5 7h6v5H6Zm8 0h6l-1 5h-5Zm-2 1h2" fill="#242424" />
        <path v-else d="M7 7h3v3H7Zm7 0h3v3h-3Z" fill="#242424" />
        <path d="M7 14q5 7 10 0" stroke="#242424" stroke-width="1.5" fill="none" />
      </template>
    </template>
    <template v-else-if="name === 'flag'">
      <path d="M11 3H5v2H2v2h3v2h6Z" fill="#d71920" />
      <path d="M11 3h2v14h-2ZM8 17h8v2H8Zm-3 2h14v2H5Z" fill="var(--mine-ink, #202020)" />
    </template>
    <template v-else>
      <path d="M11 1h2v4h-2ZM11 19h2v4h-2ZM1 11h4v2H1Zm18 0h4v2h-4ZM4 3l3 3-1 1-3-3Zm13 14 4 3-1 1-3-3ZM3 20l3-3 1 1-3 3ZM17 6l3-3 1 1-3 3ZM8 5h8v2h3v3h2v5h-2v3h-3v2H8v-2H5v-3H3v-5h2V7h3Z" fill="var(--mine-ink, #202020)" />
      <path d="M8 8h4v4H8Z" fill="#fff" />
    </template>
  </svg>
</template>
