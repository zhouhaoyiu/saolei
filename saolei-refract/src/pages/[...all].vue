<script setup lang="ts">
function back(): void {
  window.location.href = '/'
}
</script>

<template>
  <div flex="~ col">
    <button border-1 p2 m2 rounded-md @click="back()">
      back
    </button>
    Not Found
  </div>
</template>
