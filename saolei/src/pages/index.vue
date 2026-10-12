<script setup lang="ts">
import type { BlockState } from '~/types'
import GameFrame from '~/components/GameFrame.vue'
import MyBlock from '~/components/MyBlock.vue'
import { useGameClock } from '~/composables/useGameClock'

const WIDTH = 10
const HEIGHT = 10

/**
 * 初始化游戏
 * @param {number} state 初始化的状态
 * @Type {BlockState[]}
 * BlockState: 每个块的状态
 */
const state = ref(
  Array.from({ length: HEIGHT }, (_, y) =>
    Array.from({ length: WIDTH }, (_, x): BlockState => ({
      x, y, adjacentMines: 0, revealed: false,
    }),
    ),
  ),
)

// 随机生成雷的位置
function generateMines(initial: BlockState): void {
  for (const row of state.value) {
    for (const block of row) {
      if (Math.abs(initial.x - block.x) <= 1)
        continue
      if (Math.abs(initial.y - block.y) <= 1)
        continue
      block.mine = Math.random() < 0.3
    }
  }
  updateNumbers()
}

// 计算邻近的雷数
const directions = [
  [-1, -1], [-1, 0], [-1, 1],
  [0, -1], [0, 1],
  [1, -1], [1, 0], [1, 1],
]

// 更新邻近的雷数
// 如果是雷，则不需要更新
// sibling: 同一行的块
function updateNumbers(): void {
  state.value.forEach((raw, y) => {
    raw.forEach((block, x) => {
      if (block.mine)
        return
      getSiblings(block).forEach((sibling) => {
        if (sibling.mine)
          block.adjacentMines += 1
      })
    })
  })
}

function expendZero(block: BlockState) {
  if (block.mine || block.flagged || block.adjacentMines)
    return

  getSiblings(block).forEach((sibling) => {
    if (!sibling.revealed && !sibling.flagged && !sibling.mine) {
      sibling.revealed = true
      expendZero(sibling)
    }
  })
}

const mineGenerated = ref(false) // 是否已经生成雷
const gameState = ref<'playing' | 'won' | 'lost'>('playing')
const flagMode = ref(false)
const elapsed = useGameClock(() => mineGenerated.value && gameState.value === 'playing')

function reset() {
  elapsed.value = 0
  flagMode.value = false
  mineGenerated.value = false
  gameState.value = 'playing'
  state.value = Array.from({ length: HEIGHT }, (_, y) =>
    Array.from({ length: WIDTH }, (_, x): BlockState => ({
      x, y, adjacentMines: 0, revealed: false,
    })),
  )
}

function onRightClick(block: BlockState) {
  if (gameState.value !== 'playing' || block.revealed)
    return
  block.flagged = !block.flagged
  checkGameState()
}

function onClick(block: BlockState): void {
  if (gameState.value !== 'playing' || block.flagged || block.revealed)
    return
  if (!mineGenerated.value) {
    generateMines(block)
    mineGenerated.value = true
  }
  block.revealed = true
  if (block.mine) {
    gameState.value = 'lost'
    window.alert('游戏结束')
    // 显示所有雷
    state.value.forEach((raw) => {
      raw.forEach((block) => {
        if (block.mine)
          block.revealed = true
      })
    })
    return
  }
  expendZero(block)
  checkGameState()
}

// 获取邻近的块
function getSiblings(block: BlockState): BlockState[] {
  return directions.map(([dx, dy]) => {
    const nx = block.x + dx
    const ny = block.y + dy
    if (nx < 0 || nx >= WIDTH || ny < 0 || ny >= HEIGHT)
      return undefined
    return state.value[ny][nx]
  }).filter(Boolean) as BlockState[]
}

// 安全格全部揭开、雷全部标记后获胜。
function checkGameState() {
  if (!mineGenerated.value || gameState.value !== 'playing')
    return
  if (state.value.flat().every(block => block.mine ? block.flagged : block.revealed)) {
    gameState.value = 'won'
    alert('游戏胜利')
  }
}

function onCellClick(block: BlockState) {
  if (flagMode.value)
    onRightClick(block)
  else
    onClick(block)
}
</script>

<template>
  <GameFrame v-model:flag-mode="flagMode" :board="state" :started="mineGenerated" :outcome="gameState" :elapsed="elapsed" @reset="reset">
    <MyBlock v-for="block in state.flat()" :key="`${block.x}-${block.y}`" :block="block" @click="onCellClick(block)" @contextmenu.prevent="onRightClick(block)" />
  </GameFrame>
</template>
