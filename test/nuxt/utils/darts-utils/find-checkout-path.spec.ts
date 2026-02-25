import { describe, expect, it } from 'vitest'
import { findCheckoutPath } from '~/utils/darts-utils'

describe('findCheckoutPath', () => {
  it('handles scores that can be finished with three darts (T20, T20, D20)', () => {
    const result = findCheckoutPath(120)

    expect(result).not.toBeNull()
    expect(result!.totalDarts).toEqual(3)
  })

  it('handles scores that can be finished with two darts (T20, D20)', () => {
    const result = findCheckoutPath(80)

    expect(result).not.toBeNull()
    expect(result!.totalDarts).toEqual(2)
  })

  it('handles scores that can be finished with one dart (D20)', () => {
    const result = findCheckoutPath(40)

    expect(result).not.toBeNull()
    expect(result!.totalDarts).toEqual(1)
  })

  it('handles scores that can be finished with one dart (DB)', () => {
    const result = findCheckoutPath(50)

    expect(result).not.toBeNull()
    expect(result!.totalDarts).toEqual(1)
  })

  it('returns valid checkout for minimum score 2', () => {
    const result = findCheckoutPath(2)

    expect(result).not.toBeNull()
    expect(result!.darts[0]!.segment).toBe('D1')
  })

  it('returns valid checkout for maximum score 170', () => {
    const result = findCheckoutPath(170)

    expect(result).not.toBeNull()
    expect(result!.darts.at(-1)!.segment).toBe('DB')
  })

  it('throws RangeError for scores below 2', () => {
    expect(() => findCheckoutPath(0)).toThrow(RangeError)
    expect(() => findCheckoutPath(1)).toThrow(RangeError)
    expect(() => findCheckoutPath(-5)).toThrow(RangeError)
  })

  it('throws RangeError for scores above 170', () => {
    expect(() => findCheckoutPath(171)).toThrow(RangeError)
    expect(() => findCheckoutPath(200)).toThrow(RangeError)
    expect(() => findCheckoutPath(501)).toThrow(RangeError)
  })

  it('ensures all checkouts finish with a double', () => {
    const testScores = [2, 40, 80, 100, 120, 141, 167, 170]

    for (const score of testScores) {
      const result = findCheckoutPath(score)

      expect(result).not.toBeNull()

      const finishingSegment = result!.darts.at(-1)!.segment

      expect(
        finishingSegment.startsWith('D') || finishingSegment === 'DB',
      ).toBeTruthy()
    }
  })

  it('totalDarts matches sum of all dart throws', () => {
    const result = findCheckoutPath(161)

    expect(result).not.toBeNull()

    const dartCount = result!.darts.length

    expect(result!.totalDarts).toBe(dartCount)
  })
})
