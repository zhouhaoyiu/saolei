<script setup lang="ts">
import type { BlockState } from '~/types'
import GameIcon from './GameIcon.vue'

const props = withDefaults(defineProps<{ block: BlockState; preview?: boolean }>(), { preview: false })
const cellState = computed(() => props.block.flagged ? 'flagged' : props.block.revealed ? props.block.mine ? 'mine' : 'open' : 'closed')
const label = computed(() => {
  const { x, y, flagged, revealed, mine, adjacentMines } = props.block
  const state = flagged ? '已插旗' : revealed ? mine ? '地雷' : `周围 ${adjacentMines} 颗地雷` : '未揭开'
  return `第 ${y + 1} 行，第 ${x + 1} 列，${state}`
})
</script>

<template>
  <button
    type="button" class="mine-cell" data-cell
    :class="[`number-${block.adjacentMines}`, { 'is-preview': preview && !block.revealed }]"
    :data-state="cellState" :aria-label="label"
  >
    <GameIcon v-if="block.flagged" name="flag" :size="19" />
    <template v-else-if="block.revealed || preview">
      <GameIcon v-if="block.mine" name="mine" :size="20" />
      <span v-else aria-hidden="true">{{ block.adjacentMines }}</span>
    </template>
  </button>
</template>
