import { describe, it, expect, vi, afterEach } from 'vitest'
import { randomArrayItem } from '~/utils/array-utils'

describe('randomArrayItem', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('returns the first item when Math.random returns 0', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0)
    const arr = ['a', 'b', 'c']

    expect(randomArrayItem(arr)).toBe('a')
  })

  it('returns the last item when Math.random returns near 1', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.999)
    const arr = ['a', 'b', 'c']

    expect(randomArrayItem(arr)).toBe('c')
  })
})
