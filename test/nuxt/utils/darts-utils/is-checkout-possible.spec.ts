import { describe, expect, it } from 'vitest'
import { isCheckoutPossible } from '~/utils/darts-utils'

describe('isCheckoutPossible', () => {
  it('returns true for scores between 2 and 170', () => {
    expect(isCheckoutPossible(2)).toBe(true)
    expect(isCheckoutPossible(100)).toBe(true)
    expect(isCheckoutPossible(170)).toBe(true)
  })

  it('returns false for scores below 2', () => {
    expect(isCheckoutPossible(0)).toBe(false)
    expect(isCheckoutPossible(1)).toBe(false)
    expect(isCheckoutPossible(-5)).toBe(false)
  })

  it('returns false for scores above 170', () => {
    expect(isCheckoutPossible(171)).toBe(false)
    expect(isCheckoutPossible(200)).toBe(false)
    expect(isCheckoutPossible(501)).toBe(false)
  })
})
