<script setup lang="ts">
import type { BlockState } from '~/types'
import { isDev, toggleDev } from '~/composables'

reset()

const WIDTH = 10
const HEIGHT = 10

/**
 * 初始化游戏
 * @param {number} state 初始化的状态
 * @Type {BlockState[]}
 * BlockState: 每个块的状态
 */
const state = ref<BlockState[][]>([])

// 重置游戏
function reset(): void {
  state.value = Array.from({ length: HEIGHT }, (_, y) =>
    Array.from({ length: WIDTH }, (_, x): BlockState => ({
      x, y, adjacentMines: 0, revealed: false,
    }),
    ),
  )
}

// 随机生成雷的位置
function generateMines(state: BlockState[][], initial: BlockState): void {
  for (const row of state) {
    for (const block of row) {
      if (Math.abs(initial.x - block.x) <= 1)
        continue
      if (Math.abs(initial.y - block.y) <= 1)
        continue
      block.mine = Math.random() < 0.3
    }
  }
  updateNumbers(state)
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
function updateNumbers(state: BlockState[][]): void {
  state.forEach((raw, y) => {
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

// 当相邻的快都没有雷时, 将其状态全部改为已翻开
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

// 邮件设置标记
function onRightClick(block: BlockState) {
  if (block.revealed)
    return
  block.flagged = !block.flagged
  checkGameState()
}

function onClick(block: BlockState): void {
  if (!mineGenerated) {
    generateMines(state.value, block)
    mineGenerated = true
  }
  block.revealed = true
  if (block.mine) {
    state.value.forEach((raw) => {
      raw.forEach((block) => {
        if (block.mine)
          block.revealed = true
      })
    })
    alert('BOMB!!! 游戏失败')
    reset()
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
        @click="onClick(block)"
        @contextmenu.prevent="onRightClick(block)"
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
