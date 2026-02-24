import { describe, expect, it } from 'vitest'
import { isValidSegment } from '~/utils/segments'

describe('isValidSegment', () => {
  it('returns true for MISS', () => {
    expect(isValidSegment('MISS')).toBeTruthy()
  })

  it('returns true for SB (single bull)', () => {
    expect(isValidSegment('SB')).toBeTruthy()
  })

  it('returns true for DB (double bull)', () => {
    expect(isValidSegment('DB')).toBeTruthy()
  })

  it('returns true for valid single segments', () => {
    for (let i = 1; i <= 20; i++) {
      expect(isValidSegment(`S${i}`)).toBeTruthy()
    }
  })

  it('returns true for valid double segments', () => {
    for (let i = 1; i <= 20; i++) {
      expect(isValidSegment(`D${i}`)).toBeTruthy()
    }
  })

  it('returns true for valid triple segments', () => {
    for (let i = 1; i <= 20; i++) {
      expect(isValidSegment(`T${i}`)).toBeTruthy()
    }
  })

  it('returns false for non-existent segments', () => {
    expect(isValidSegment('S21')).toBeFalsy()
    expect(isValidSegment('D25')).toBeFalsy()
    expect(isValidSegment('T25')).toBeFalsy()
    expect(isValidSegment('S0')).toBeFalsy()
  })

  it('returns false for invalid format', () => {
    expect(isValidSegment('X10')).toBeFalsy()
    expect(isValidSegment('10')).toBeFalsy()
    expect(isValidSegment('D')).toBeFalsy()
    expect(isValidSegment('')).toBeFalsy()
  })

  it('returns false for random strings', () => {
    expect(isValidSegment('invalid')).toBeFalsy()
    expect(isValidSegment('abc')).toBeFalsy()
    expect(isValidSegment('123')).toBeFalsy()
  })
})
