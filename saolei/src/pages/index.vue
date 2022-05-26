/* eslint-disable no-alert */

<script setup lang="ts">
import type { BlockState } from '~/types'

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
  if (block.adjacentMines)
    return

  getSiblings(block).forEach((sibling) => {
    if (!sibling.revealed) {
      sibling.revealed = true
      expendZero(sibling)
    }
  })
}

let mineGenerated = false // 是否已经生成雷
const DEV = false // 是否是开发模式

function onRightClick(block: BlockState) {
  if (block.revealed)
    return
  block.flagged = !block.flagged
  checkGameState()
}

function onClick(e: MouseEvent, block: BlockState): void {
  if (!mineGenerated) {
    generateMines(block)
    mineGenerated = true
  }
  block.revealed = true
  expendZero(block)
  if (block.mine) {
    window.alert('游戏结束')
    // 显示所有雷
    state.value.forEach((raw) => {
      raw.forEach((block) => {
        if (block.mine)
          block.revealed = true
      })
    })
  }
  checkGameState()
}

// 根据状态渲染块的样式
function getBlockClass(block: BlockState) {
  if (block.flagged)
    return 'bg-gray-500/10'
  if (!block.revealed)
    return 'bg-gray-500/10  hover:bg-gray-500/20'

  return block.mine ? 'bg-red-500/50' : `${numberColors[block.adjacentMines]}`
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

// 检查游戏状态
function checkGameState() {
  if (!mineGenerated)
    return
  const blocks = state.value.flat()

  if (blocks.every(block => block.revealed || block.flagged)) {
    if (blocks.some(block => !block.mine && block.flagged))
      alert('you cheat!!! 游戏失败')
    else
      alert('游戏胜利')
  }
}
</script>c:\Users\Administrator\Desktop\saolei\saolei-refract

<template>
  <div p6 text-3xl>
    扫雷
  </div>
  <div p6>
    <div v-for="row, y in state" :key="y" flex="~" items-center justify-center>
      <button
        v-for="block, x in row" :key="x" flex="~ gap-1" m="0.5" items-center justify-center w-10 h-10
        border="1 gray-400/10" :class="getBlockClass(block)" @click="onClick($event, block)"
        @contextmenu.prevent="onRightClick(block)"
      >
        <template v-if="block.flagged">
          🚩
        </template>
        <template v-else-if="block.revealed || DEV">
          <div v-if="block.mine">
            💣
          </div>
          <div v-else>
            {{ block.adjacentMines }}
          </div>
        </template>
      </button>
    </div>
  </div>
</template>
