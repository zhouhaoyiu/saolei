import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { GamePlay } from '../src/composables/logic'

beforeEach(() => {
  vi.stubGlobal('alert', vi.fn())
  vi.spyOn(Math, 'random').mockReturnValue(0)
})
afterEach(() => {
  vi.restoreAllMocks()
  vi.unstubAllGlobals()
})

function startedGame() {
  const game = new GamePlay(10, 10)
  game.onClick(game.board[0][0])
  return game
}

describe('gameplay regressions', () => {
  it('initializes the requested board', () => {
    const game = new GamePlay(3, 4)
    expect(game.board).toHaveLength(4)
    expect(game.board[0]).toHaveLength(3)
    expect(game.state.value.gameState).toBe('playing')
  })

  it('ignores flagged cells before generating mines', () => {
    const game = new GamePlay(3, 3)
    const block = game.board[0][0]
    game.onRightClick(block)
    game.onClick(block)
    expect(game.state.value.mineGenerated).toBe(false)
    expect(block.revealed).toBe(false)
    expect(alert).not.toHaveBeenCalled()
  })

  it('ignores a flagged mine', () => {
    const game = startedGame()
    const mine = game.board[2][2]
    expect(mine.mine).toBe(true)
    game.onRightClick(mine)
    game.onClick(mine)
    expect(mine.revealed).toBe(false)
    expect(game.board[2][2]).toBe(mine)
    expect(alert).not.toHaveBeenCalled()
  })

  it('keeps a flag closed during expansion and allows removing it', () => {
    const game = new GamePlay(3, 3)
    game.state.value.mineGenerated = true
    const marked = game.board[1][1]
    game.onRightClick(marked)
    game.onClick(game.board[0][0])
    expect(marked.revealed).toBe(false)
    expect(game.state.value.gameState).toBe('playing')
    expect(alert).not.toHaveBeenCalled()
    game.onRightClick(marked)
    expect(marked.flagged).toBe(false)
    game.onClick(marked)
    expect(game.state.value.gameState).toBe('won')
    expect(alert).toHaveBeenCalledExactlyOnceWith('游戏胜利')
  })

  it('never expands a mine, even if its neighbor count is zero', () => {
    const game = new GamePlay(3, 3)
    const mine = game.board[1][1]
    mine.mine = true
    game.expendZero(mine)
    expect(game.board.flat().every(block => !block.revealed)).toBe(true)
  })

  it('skips mines while expanding safe neighbors', () => {
    const game = new GamePlay(3, 3)
    game.board[1][1].mine = true
    game.expendZero(game.board[0][0])
    expect(game.board[1][1].revealed).toBe(false)
  })

  it('reports only loss when a mine is clicked', () => {
    const game = startedGame()
    const board = game.board
    game.onClick(game.board[2][2])
    expect(game.state.value.gameState).toBe('lost')
    expect(game.board).toBe(board)
    expect(alert).toHaveBeenCalledExactlyOnceWith('BOMB!!! 游戏失败')
    expect(game.board.flat().filter(block => block.mine).every(block => block.revealed)).toBe(true)
  })

  it('ignores left and right clicks after loss', () => {
    const game = startedGame()
    game.onClick(game.board[2][2])
    const before = JSON.stringify(game.state.value)
    vi.mocked(alert).mockClear()
    game.onClick(game.board[3][3])
    game.onRightClick(game.board[1][2])
    game.checkGameState()
    expect(JSON.stringify(game.state.value)).toBe(before)
    expect(alert).not.toHaveBeenCalled()
  })

  it('wins once and ignores further clicks and state checks', () => {
    const game = startedGame()
    for (const mine of game.board.flat().filter(block => block.mine))
      game.onRightClick(mine)
    expect(game.state.value.gameState).toBe('won')
    expect(alert).toHaveBeenCalledExactlyOnceWith('游戏胜利')
    const before = JSON.stringify(game.state.value)
    game.onClick(game.board[2][2])
    game.onRightClick(game.board[2][2])
    game.checkGameState()
    expect(JSON.stringify(game.state.value)).toBe(before)
    expect(alert).toHaveBeenCalledTimes(1)
  })

  it('ignores already revealed cells', () => {
    const game = startedGame()
    const expand = vi.spyOn(game, 'expendZero')
    const generate = vi.spyOn(game, 'generateMines')
    game.onClick(game.board[0][0])
    expect(expand).not.toHaveBeenCalled()
    expect(generate).not.toHaveBeenCalled()
  })

  it('resets board, flags, generation state and outcome', () => {
    const game = startedGame()
    game.onRightClick(game.board[3][3])
    game.onClick(game.board[2][2])
    game.reset()
    expect(game.state.value.gameState).toBe('playing')
    expect(game.state.value.mineGenerated).toBe(false)
    expect(game.board.flat().every(block => !block.mine && !block.flagged && !block.revealed)).toBe(true)
    game.onClick(game.board[0][0])
    expect(game.state.value.mineGenerated).toBe(true)
  })
})
