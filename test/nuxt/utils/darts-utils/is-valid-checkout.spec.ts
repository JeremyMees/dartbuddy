import { describe, expect, it } from 'vitest'
import { isValidCheckout } from '~/utils/darts-utils'

describe('isValidCheckout', () => {
  it('should allow correct values when outType is STRAIGHT', () => {
    for (let i = 1; i <= 20; i++) {
      expect(isValidCheckout('STRAIGHT', `S${i}` as Segment)).toBeTruthy()
      expect(isValidCheckout('STRAIGHT', `D${i}` as Segment)).toBeTruthy()
      expect(isValidCheckout('STRAIGHT', `T${i}` as Segment)).toBeTruthy()
    }

    expect(isValidCheckout('STRAIGHT', 'SB' as Segment)).toBeTruthy()
    expect(isValidCheckout('STRAIGHT', 'DB' as Segment)).toBeTruthy()
  })

  it('should allow correct values when outType is DOUBLE', () => {
    for (let i = 1; i <= 20; i++) {
      expect(isValidCheckout('DOUBLE', `S${i}` as Segment)).toBeFalsy()
      expect(isValidCheckout('DOUBLE', `D${i}` as Segment)).toBeTruthy()
      expect(isValidCheckout('DOUBLE', `T${i}` as Segment)).toBeFalsy()
    }

    expect(isValidCheckout('DOUBLE', 'SB' as Segment)).toBeFalsy()
    expect(isValidCheckout('DOUBLE', 'DB' as Segment)).toBeTruthy()
  })

  it('should allow correct values when outType is MASTER', () => {
    for (let i = 1; i <= 20; i++) {
      expect(isValidCheckout('MASTER', `S${i}` as Segment)).toBeFalsy()
      expect(isValidCheckout('MASTER', `D${i}` as Segment)).toBeTruthy()
      expect(isValidCheckout('MASTER', `T${i}` as Segment)).toBeTruthy()
    }

    expect(isValidCheckout('MASTER', 'SB' as Segment)).toBeFalsy()
    expect(isValidCheckout('MASTER', 'DB' as Segment)).toBeTruthy()
  })

  it('should always return false when missed', () => {
    expect(isValidCheckout('STRAIGHT', 'MISS' as Segment)).toBeFalsy()
    expect(isValidCheckout('DOUBLE', 'MISS' as Segment)).toBeFalsy()
    expect(isValidCheckout('MASTER', 'MISS' as Segment)).toBeFalsy()
  })
})
