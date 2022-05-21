<script setup lang="ts">
import type { BlockState } from '~/types'
import { isDev } from '~/composables'
defineProps<{ block: BlockState }>()

const numberColors = [
  'text-transparent',
  'text-blue-500',
  'text-green-500',
  'text-yellow-500',
  'text-orange-500',
  'text-red-500',
  'text-purple-500',
  'text-pink-500',
  'text-teal-500',
]
// 根据状态渲染块的样式
function getBlockClass(block: BlockState) {
  if (block.flagged)
    return 'bg-gray-500/10'
  if (!block.revealed)
    return 'bg-gray-500/10  hover:bg-gray-500/20'

  return block.mine ? 'bg-red-500/50' : `${numberColors[block.adjacentMines]}`
}
</script>

<template>
  <button
    flex="~ gap-1" m="0.5" items-center justify-center w-10 h-10 border="1 gray-400/10"
    :class="getBlockClass(block)"
  >
    <template v-if="block.flagged">
      🚩
    </template>
    <template v-else-if="block.revealed || isDev">
      <div v-if="block.mine">
        💣
      </div>
      <div v-else>
        {{ block.adjacentMines }}
      </div>
    </template>
  </button>
</template>
