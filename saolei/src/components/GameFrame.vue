<script setup lang="ts">
import type { BlockState } from '~/types'
import GameIcon from './GameIcon.vue'

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
const progress = computed(() => props.started && safeCount.value ? Math.round(revealed.value / safeCount.value * 100) : 0)
const time = computed(() => `${Math.floor(props.elapsed / 60).toString().padStart(2, '0')}:${(props.elapsed % 60).toString().padStart(2, '0')}`)
const status = computed(() => props.outcome === 'won' ? '全部排除' : props.outcome === 'lost' ? '遇到地雷' : props.started ? '探索中' : '准备开始')
const title = computed(() => props.outcome === 'won' ? '漂亮，成功过关。' : props.outcome === 'lost' ? '再试一次吧。' : props.started ? '下一格，慢慢想。' : '从这一格开始。')
const message = computed(() => props.outcome === 'won' ? '每一格都找到了答案，下一局见。' : props.outcome === 'lost' ? '棋盘已经保留，看看刚才漏掉的线索。' : props.started ? '数字告诉你，周围八格藏着多少颗雷。' : '第一步总是安全的。留意数字，找到藏起来的地雷。')
</script>

<template>
  <section class="game-layout" :data-outcome="outcome">
    <aside class="game-sidebar">
      <div class="game-intro">
        <div class="status-pill" role="status">
          <span class="status-dot" />{{ status }}
        </div>
        <h2>{{ title }}</h2>
        <p class="game-description">{{ message }}</p>
      </div>

      <div class="game-stats">
        <div class="stat">
          <span class="stat-label"><GameIcon name="clock" :size="15" />用时</span>
          <strong data-counter="time">{{ time }}</strong>
        </div>
        <div class="stat">
          <span class="stat-label"><GameIcon name="flag" :size="15" />已标记</span>
          <strong data-counter="flags">{{ flagged.toString().padStart(2, '0') }}<small>/ {{ started ? mines : '—' }}</small></strong>
        </div>
      </div>

      <div class="progress-section">
        <div class="progress-caption"><span>安全区域</span><span>{{ progress }}%</span></div>
        <div class="progress-track" role="progressbar" aria-label="已揭开的安全区域" :aria-valuenow="progress" aria-valuemin="0" aria-valuemax="100">
          <span :style="{ width: `${progress}%` }" />
        </div>
      </div>

      <button type="button" class="new-game-button" @click="$emit('reset')">
        <GameIcon name="reset" :size="18" />新的一局
      </button>

      <div class="how-to">
        <div class="how-to-title"><GameIcon name="help" :size="15" />小提示</div>
        <p>揭开所有安全格，标记全部地雷，即可过关。</p>
        <div class="key-hints"><span><kbd>点击</kbd> 揭开</span><span><kbd>右键</kbd> 插旗</span></div>
      </div>
    </aside>

    <div class="board-panel">
      <div class="board-heading">
        <div><span class="board-kicker">MINE FIELD</span><h3>经典棋盘 <span>{{ board[0]?.length || 0 }} × {{ board.length }}</span></h3></div>
        <span class="board-mode" :class="{ 'is-flagging': flagMode }"><GameIcon :name="flagMode ? 'flag' : 'reveal'" :size="14" />{{ flagMode ? '插旗模式' : '探索模式' }}</span>
      </div>
      <div class="mine-grid" :style="{ '--columns': board[0]?.length || 10 }" role="group" aria-label="扫雷棋盘">
        <slot />
      </div>
      <div class="board-toolbar">
        <div class="input-modes" role="group" aria-label="点击操作">
          <button type="button" :aria-pressed="!flagMode" @click="$emit('update:flagMode', false)"><GameIcon name="reveal" :size="16" />揭开</button>
          <button type="button" :aria-pressed="flagMode" @click="$emit('update:flagMode', true)"><GameIcon name="flag" :size="16" />插旗</button>
        </div>
        <button v-if="allowPreview" type="button" class="preview-button" :aria-pressed="preview" @click="$emit('togglePreview')"><GameIcon name="eye" :size="17" />透视</button>
        <span v-else class="board-footnote">首击安全</span>
      </div>
      <p class="touch-hint">手机上切换「插旗」，再轻点格子进行标记。</p>
    </div>
  </section>
</template>
