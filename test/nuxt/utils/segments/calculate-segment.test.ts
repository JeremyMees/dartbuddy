import { describe, expect, it } from 'vitest'
import { calculateSegment } from '~/utils/segments'

describe('calculateSegment', () => {
  it('returns MISS for any multiplier', () => {
    expect(calculateSegment(null, 1)).toBe('MISS')
    expect(calculateSegment(null, 2)).toBe('MISS')
    expect(calculateSegment(null, 3)).toBe('MISS')
  })

  describe('when number is 25', () => {
    it('returns SB for single (multiplier 1)', () => {
      expect(calculateSegment(25, 1)).toBe('SB')
    })

    it('returns DB for double (multiplier 2)', () => {
      expect(calculateSegment(25, 2)).toBe('DB')
    })

    it('returns MISS for triple (multiplier 3)', () => {
      expect(calculateSegment(25, 3)).toBe('MISS')
    })
  })

  it('returns correct single segment for multiplier 1', () => {
    for (let i = 1; i <= 20; i++) {
      expect(calculateSegment(i, 1)).toBe(`S${i}`)
    }
  })

  it('returns correct double segment for multiplier 2', () => {
    for (let i = 1; i <= 20; i++) {
      expect(calculateSegment(i, 2)).toBe(`D${i}`)
    }
  })

  it('returns correct triple segment for multiplier 3', () => {
    for (let i = 1; i <= 20; i++) {
      expect(calculateSegment(i, 3)).toBe(`T${i}`)
    }
  })

  it('returns MISS for numbers outside valid range', () => {
    expect(calculateSegment(0, 1)).toBe('MISS')
    expect(calculateSegment(21, 1)).toBe('MISS')
    expect(calculateSegment(100, 1)).toBe('MISS')
    expect(calculateSegment(-5, 1)).toBe('MISS')
  })

  it('returns MISS for invalid multipliers', () => {
    expect(calculateSegment(20, 0)).toBe('MISS')
    expect(calculateSegment(20, 4)).toBe('MISS')
    expect(calculateSegment(20, -1)).toBe('MISS')
  })
})
