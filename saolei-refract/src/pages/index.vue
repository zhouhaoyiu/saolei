<script setup lang="ts">
import { isDark, isDev, toggleDev } from '~/composables'
import { GamePlay } from '~/composables/logic'

const play = new GamePlay(10, 10)
const gameTime = ref(0)

onMounted(() => {
  console.log(isDev.value)
  console.log(isDark.value)
  setInterval(() => {
    gameTime.value++
  }, 1000)
})

useStorage('play', play.state)
useStorage('gameTime', gameTime)

const state = computed(() => play.board)
const reset = () => {
  gameTime.value = 0
  play.reset()
}
</script>

<template>
  <div p6 text-3xl>
    扫雷
  </div>
  <div text-2xl>
    游戏时间: <span text-red-500>{{ gameTime }}</span>
  </div>
  <div p6>
    <div v-for="row, y in state" :key="y" flex="~" items-center justify-center>
      <MyBlock
        v-for="block, x in row" :key="x" :block="block" @click="play.onClick(block)"
        @contextmenu.prevent="play.onRightClick(block)"
      />
    </div>
  </div>
  <div flex="~ gap-1" justify-center>
    <button btn @click="toggleDev()">
      {{ isDev ? 'DEV' : 'NORMAL' }}
    </button>
    <button btn @click="reset()">
      RESET
    </button>
  </div>
</template>
