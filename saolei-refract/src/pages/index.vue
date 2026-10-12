<script setup lang="ts">
import type { BlockState } from '~/types'
import { isDev, toggleDev } from '~/composables'
import { GamePlay } from '~/composables/logic'
import { useGameClock } from '~/composables/useGameClock'
import GameFrame from '~/components/GameFrame.vue'
import MyBlock from '~/components/MyBlock.vue'

const play = new GamePlay(10, 10)
const flagMode = ref(false)
useStorage('play', play.state)
const elapsed = useGameClock(() => play.state.value.mineGenerated && play.state.value.gameState === 'playing', useStorage('gameTime', 0))
const state = computed(() => play.board)
function reset() {
  elapsed.value = 0
  flagMode.value = false
  play.reset()
}
function onCellClick(block: BlockState) {
  if (flagMode.value)
    play.onRightClick(block)
  else
    play.onClick(block)
}
</script>

<template>
  <GameFrame
    v-model:flag-mode="flagMode" :board="state" :started="play.state.value.mineGenerated"
    :outcome="play.state.value.gameState" :elapsed="elapsed" :preview="isDev" allow-preview
    @reset="reset" @toggle-preview="toggleDev()"
  >
    <MyBlock v-for="block in state.flat()" :key="`${block.x}-${block.y}`" :block="block" :preview="isDev" @click="onCellClick(block)" @contextmenu.prevent="play.onRightClick(block)" />
  </GameFrame>
</template>
