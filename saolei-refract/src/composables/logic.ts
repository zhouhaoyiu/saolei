import type { Ref } from 'vue'
import type { BlockState } from './../types'

// 计算邻近的雷数方向
const directions = [
  [-1, -1],
  [-1, 0],
  [-1, 1],
  [0, -1],
  [0, 1],
  [1, -1],
  [1, 0],
  [1, 1],
]
interface GameState {
  board: BlockState[][]
  mineGenerated: boolean
  gameState: 'playing' | 'won' | 'lost'
}
export class GamePlay {
  state = ref() as Ref<GameState>

  constructor(public width: number, public height: number) {
    if (!width || !height)
      this.height = this.width = 10
    this.reset()
  }

  get board() {
    return this.state.value.board
  }

  // 重置游戏
  reset() {
    this.state.value = {
      mineGenerated: false,
      gameState: 'playing',
      board: Array.from({ length: this.height }, (_, y) =>
        Array.from(
          { length: this.width },
          (_, x): BlockState => ({
            x,
            y,
            adjacentMines: 0,
            revealed: false,
          }),
        ),
      ),
    }
  }

  // 生成雷
  generateMines(state: BlockState[][], initial: BlockState): void {
    for (const row of state) {
      for (const block of row) {
        if (Math.abs(initial.x - block.x) <= 1)
          continue
        if (Math.abs(initial.y - block.y) <= 1)
          continue
        block.mine = Math.random() < 0.3
      }
    }
    this.updateNumbers(state)
  }

  // 更新邻近的雷数
  // 如果是雷，则不需要更新
  // sibling: 同一行的块
  updateNumbers(state: BlockState[][]): void {
    state.forEach((raw, _y) => {
      raw.forEach((block, _x) => {
        if (block.mine)
          return
        this.getSiblings(block).forEach((sibling) => {
          if (sibling.mine)
            block.adjacentMines += 1
        })
      })
    })
  }

  // 扩展雷数为0的块
  expendZero(block: BlockState) {
    if (block.adjacentMines)
      return

    this.getSiblings(block).forEach((sibling) => {
      if (!sibling.revealed) {
        sibling.revealed = true
        this.expendZero(sibling)
      }
    })
  }

  // 标记块
  onRightClick(block: BlockState) {
    if (this.state.value.gameState !== 'playing')
      return
    if (block.revealed)
      return
    block.flagged = !block.flagged
    this.checkGameState()
  }

  // 揭开块
  onClick(block: BlockState): void {
    if (!this.state.value.mineGenerated) {
      this.generateMines(this.board, block)
      this.state.value.mineGenerated = true
    }
    block.revealed = true
    if (block.mine) {
      this.state.value.gameState = 'lost'

      this.board.forEach((raw) => {
        raw.forEach((block) => {
          if (block.mine)
            block.revealed = true
        })
      })
      alert('BOMB!!! 游戏失败')
      this.reset()
    }
    this.expendZero(block)
    this.checkGameState()
  }

  // 获取邻近的块
  getSiblings(block: BlockState): BlockState[] {
    return directions
      .map(([dx, dy]) => {
        const nx = block.x + dx
        const ny = block.y + dy
        if (nx < 0 || nx >= this.width || ny < 0 || ny >= this.height)
          return undefined
        return this.board[ny][nx]
      })
      .filter(Boolean) as BlockState[]
  }

  // 检查游戏状态
  checkGameState() {
    if (!this.state.value.mineGenerated)
      return
    const blocks = this.board.flat()

    // 检查是否所有的块都已经被揭开
    if (blocks.every(block => block.revealed || block.flagged)) {
      // 如果存在未揭开且被标记的雷，则游戏失败
      if (blocks.some(block => !block.mine && block.flagged)) {
        alert('游戏失败')
        this.state.value.gameState = 'lost'
      }
      else {
        alert('游戏胜利')
        this.state.value.gameState = 'won'
      }
    }
  }
}
