import { describe, expect, it } from 'vitest'
import { getSegmentPrefix } from '~/utils/segments'

describe('getSegmentPrefix', () => {
  it('returns S for single', () => {
    expect(getSegmentPrefix(1)).toBe('S')
  })

  it('returns D for double', () => {
    expect(getSegmentPrefix(2)).toBe('D')
  })

  it('returns T for triple', () => {
    expect(getSegmentPrefix(3)).toBe('T')
  })

  it('returns S for 0', () => {
    expect(getSegmentPrefix(0)).toBe('S')
  })

  it('returns S for negative numbers', () => {
    expect(getSegmentPrefix(-1)).toBe('S')
  })

  it('returns S for values greater than 3', () => {
    expect(getSegmentPrefix(4)).toBe('S')
    expect(getSegmentPrefix(10)).toBe('S')
  })
})
