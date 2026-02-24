import { describe, expect, it } from 'vitest'
import { calculateSegmentScore } from '~/utils/segments'

describe('calculateSegmentScore', () => {
  it('returns 0 for MISS', () => {
    expect(calculateSegmentScore('MISS')).toBe(0)
  })

  it('returns 25 for SB (single bull)', () => {
    expect(calculateSegmentScore('SB')).toBe(25)
  })

  it('returns 50 for DB (double bull)', () => {
    expect(calculateSegmentScore('DB')).toBe(50)
  })

  it('returns correct score for single segments', () => {
    for (let i = 1; i <= 20; i++) {
      expect(calculateSegmentScore(`S${i}` as Segment)).toBe(i)
    }
  })

  it('returns correct score for double segments', () => {
    for (let i = 1; i <= 20; i++) {
      expect(calculateSegmentScore(`D${i}` as Segment)).toBe(i * 2)
    }
  })

  it('returns correct score for triple segments', () => {
    for (let i = 1; i <= 20; i++) {
      expect(calculateSegmentScore(`T${i}` as Segment)).toBe(i * 3)
    }
  })
})
