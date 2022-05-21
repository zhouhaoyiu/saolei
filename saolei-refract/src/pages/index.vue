<script setup lang="ts">
import { isDev, toggleDev } from '~/composables'
import { GamePlay } from '~/composables/logic'

const play = new GamePlay(10, 10)
useStorage('play', play.state)
const state = computed(() => play.board)
</script>

<template>
  <div p6 text-3xl>
    扫雷
  </div>
  <div p6>
    <div v-for="row, y in state" :key="y" flex="~" items-center justify-center>
      <MyBlock
        v-for="block, x in row" :key="x"
        :block="block"
        @click="play.onClick(block)"
        @contextmenu.prevent="play.onRightClick(block)"
      />
    </div>
  </div>
  <div flex="~ gap-1" justify-center>
    <button btn @click="toggleDev()">
      {{ isDev ? 'DEV' : 'NORMAL' }}
    </button>
    <button btn @click="play.reset()">
      RESET
    </button>
  </div>
</template>
