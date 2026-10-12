import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import Board from '../src/pages/index.vue'

beforeEach(() => {
  vi.stubGlobal('alert', vi.fn())
  vi.spyOn(Math, 'random').mockReturnValue(0)
})
afterEach(() => {
  vi.restoreAllMocks()
  vi.unstubAllGlobals()
})

function board() {
  const wrapper = mount(Board)
  // Select cell buttons independently of the root-level toolbar.
  const cells = wrapper.findAll('button[border]')
  return { wrapper, cells }
}

describe('public board behavior', () => {
  it('renders all 100 cells', () => {
    const { wrapper, cells } = board()
    expect(cells).toHaveLength(100)
    expect(cells.every(cell => cell.text() === '')).toBe(true)
    wrapper.unmount()
  })

  it('reports only loss after clicking a mine and remains finished', async () => {
    const { wrapper, cells } = board()
    await cells[0].trigger('click')
    await cells[22].trigger('click')
    await cells[33].trigger('click')
    expect(alert).toHaveBeenCalledExactlyOnceWith('游戏结束')
    wrapper.unmount()
  })

  it('does not reveal a flagged mine', async () => {
    const { wrapper, cells } = board()
    await cells[0].trigger('click')
    await cells[22].trigger('contextmenu')
    await cells[22].trigger('click')
    expect(cells[22].text()).toBe('🚩')
    expect(alert).not.toHaveBeenCalled()
    await cells[22].trigger('contextmenu')
    await cells[22].trigger('click')
    expect(alert).toHaveBeenCalledExactlyOnceWith('游戏结束')
    wrapper.unmount()
  })

  it('keeps a flagged safe cell closed during flood expansion', async () => {
    const { wrapper, cells } = board()
    await cells[11].trigger('contextmenu')
    await cells[0].trigger('click')
    expect(cells[11].text()).toBe('🚩')
    await cells[11].trigger('contextmenu')
    expect(cells[11].text()).toBe('')
    await cells[11].trigger('click')
    expect(cells[11].text()).toBe('1')
    expect(alert).not.toHaveBeenCalled()
    wrapper.unmount()
  })

  it('wins once and ignores clicks after winning', async () => {
    const { wrapper, cells } = board()
    await cells[0].trigger('click')
    for (let y = 2; y < 10; y++) {
      for (let x = 2; x < 10; x++)
        await cells[y * 10 + x].trigger('contextmenu')
    }
    expect(alert).toHaveBeenCalledExactlyOnceWith('游戏胜利')
    await cells[22].trigger('click')
    await cells[22].trigger('contextmenu')
    expect(cells[22].text()).toBe('🚩')
    expect(alert).toHaveBeenCalledTimes(1)
    wrapper.unmount()
  })

  it('starts a fresh game through RESET', async () => {
    const { wrapper, cells } = board()
    await cells[0].trigger('click')
    await cells[22].trigger('click')
    const reset = wrapper.findAll('button').find(button => button.text() === 'RESET')
    expect(reset).toBeDefined()
    await reset!.trigger('click')
    const freshCells = wrapper.findAll('button[border]')
    expect(freshCells.every(cell => cell.text() === '')).toBe(true)
    await freshCells[0].trigger('click')
    expect(freshCells[0].text()).toBe('0')
    expect(freshCells[22].text()).toBe('')
    wrapper.unmount()
  })
})
