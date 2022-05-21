import type { BlockState } from './../types'
export class GamePlay {
  WIDTH = 10
  HEIGHT = 10
  state = ref<BlockState[][]>([])
  mineGenerated = false // 是否已经生成雷
  constructor(public width: number, public height: number) {
    this.reset()
  }

  reset() {
    this.mineGenerated = false
    this.state.value = Array.from({ length: this.height }, (_, y) =>
      Array.from(
        { length: this.width },
        (_, x): BlockState => ({
          x,
          y,
          adjacentMines: 0,
          revealed: false,
        }),
      ),
    )
  }

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

  // 计算邻近的雷数
  directions = [
    [-1, -1],
    [-1, 0],
    [-1, 1],
    [0, -1],
    [0, 1],
    [1, -1],
    [1, 0],
    [1, 1],
  ]

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

  onRightClick(block: BlockState) {
    if (block.revealed)
      return
    block.flagged = !block.flagged
    this.checkGameState()
  }

  onClick(block: BlockState): void {
    if (!this.mineGenerated) {
      this.generateMines(this.state.value, block)
      this.mineGenerated = true
    }
    block.revealed = true
    if (block.mine)
      alert('游戏结束')
    this.expendZero(block)
    this.checkGameState()
  }

  // 获取邻近的块
  getSiblings(block: BlockState): BlockState[] {
    return this.directions
      .map(([dx, dy]) => {
        const nx = block.x + dx
        const ny = block.y + dy
        if (nx < 0 || nx >= this.WIDTH || ny < 0 || ny >= this.HEIGHT)
          return undefined
        return this.state.value[ny][nx]
      })
      .filter(Boolean) as BlockState[]
  }

  checkGameState() {
    if (!this.mineGenerated)
      return
    const blocks = this.state.value.flat()

    if (blocks.every(block => block.revealed || block.flagged)) {
      if (blocks.some(block => !block.mine && block.flagged))
        alert('you cheat')
      else alert('游戏胜利')
    }
  }
}
