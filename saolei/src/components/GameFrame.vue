<script setup lang="ts">
import type { BlockState } from '~/types'
import GameIcon from './GameIcon.vue'
import LedDisplay from './LedDisplay.vue'

const props = withDefaults(defineProps<{
  board: BlockState[][]
  started: boolean
  outcome: 'playing' | 'won' | 'lost'
  elapsed: number
  flagMode: boolean
  preview?: boolean
  allowPreview?: boolean
}>(), { preview: false, allowPreview: false })

defineEmits<{
  reset: []
  'update:flagMode': [value: boolean]
  'togglePreview': []
}>()

const cells = computed(() => props.board.flat())
const flagged = computed(() => cells.value.filter(cell => cell.flagged).length)
const mines = computed(() => cells.value.filter(cell => cell.mine).length)
const revealed = computed(() => cells.value.filter(cell => cell.revealed && !cell.mine).length)
const safeCount = computed(() => cells.value.length - mines.value)
const remaining = computed(() => {
  if (!props.started)
    return '---'
  const count = mines.value - flagged.value
  return count < 0 ? `-${String(-count).padStart(2, '0')}` : String(count).padStart(3, '0')
})
const time = computed(() => `${Math.floor(props.elapsed / 60).toString().padStart(2, '0')}:${(props.elapsed % 60).toString().padStart(2, '0')}`)
const status = computed(() => props.outcome === 'won' ? '已完成' : props.outcome === 'lost' ? '踩到地雷' : props.started ? `已揭开 ${revealed.value} / ${safeCount.value}` : '点击任意格开始')
</script>

<template>
  <section class="game-layout" :data-outcome="outcome">
    <div class="scoreboard">
      <div class="counter-group">
        <span class="counter-label">剩余地雷</span>
        <LedDisplay :value="remaining" :label="started ? `剩余 ${mines - flagged} 颗地雷` : '首次揭开后生成地雷'" />
      </div>
      <button type="button" class="new-game-button" title="新的一局" aria-label="新的一局" @click="$emit('reset')">
        <GameIcon :name="outcome === 'lost' ? 'face-lost' : outcome === 'won' ? 'face-won' : 'face'" :size="30" />
        <span class="sr-only">新的一局</span>
      </button>
      <div class="counter-group clock-group">
        <span class="counter-label">用时</span>
        <LedDisplay :value="time" :label="`用时 ${time}`" />
        <span class="sr-only" data-counter="time">{{ time }}</span>
      </div>
    </div>

    <div class="mine-grid" :style="{ '--columns': board[0]?.length || 10 }" role="group" aria-label="扫雷棋盘">
      <slot />
    </div>

    <div class="board-toolbar">
      <div class="input-modes" role="group" aria-label="点击操作">
        <button type="button" :aria-pressed="!flagMode" @click="$emit('update:flagMode', false)">揭开</button>
        <button type="button" :aria-pressed="flagMode" @click="$emit('update:flagMode', true)">插旗</button>
      </div>
      <button v-if="allowPreview" type="button" class="preview-button" :aria-pressed="preview" @click="$emit('togglePreview')">透视</button>
      <span v-else class="safe-note">首步安全</span>
    </div>

    <div class="statusbar">
      <span class="game-status" role="status">{{ status }}</span>
      <span data-counter="flags">标记 {{ flagged.toString().padStart(2, '0') }} / {{ started ? mines : '—' }}</span>
    </div>
  </section>
</template>
