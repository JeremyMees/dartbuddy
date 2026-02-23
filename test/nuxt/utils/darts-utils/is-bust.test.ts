import { describe, expect, it } from 'vitest'
import { isBust } from '~/utils/darts-utils'

describe('isBust', () => {
  describe('when remaining is negative', () => {
    it('returns true regardless of outType or lastSegment', () => {
      expect(isBust('DOUBLE', -1, 'D20')).toBeTruthy()
      expect(isBust('MASTER', -5, 'T20')).toBeTruthy()
      expect(isBust('STRAIGHT', -10, 'S20')).toBeTruthy()
    })
  })

  describe('when remaining is 1', () => {
    it('returns true for DOUBLE out', () => {
      expect(isBust('DOUBLE', 1, 'S1')).toBeTruthy()
    })

    it('returns true for MASTER out', () => {
      expect(isBust('MASTER', 1, 'S1')).toBeTruthy()
    })

    it('returns false for STRAIGHT out', () => {
      expect(isBust('STRAIGHT', 1, 'S1')).toBeFalsy()
    })
  })

  describe('when remaining is 0 with DOUBLE out', () => {
    it('returns false when last segment is a double', () => {
      expect(isBust('DOUBLE', 0, 'D20')).toBeFalsy()
      expect(isBust('DOUBLE', 0, 'D1')).toBeFalsy()
      expect(isBust('DOUBLE', 0, 'DB')).toBeFalsy()
    })

    it('returns true when last segment is a single', () => {
      expect(isBust('DOUBLE', 0, 'S20')).toBeTruthy()
    })

    it('returns true when last segment is a triple', () => {
      expect(isBust('DOUBLE', 0, 'T20')).toBeTruthy()
    })
  })

  describe('when remaining is 0 with MASTER out', () => {
    it('returns false when last segment is a double', () => {
      expect(isBust('MASTER', 0, 'D20')).toBeFalsy()
      expect(isBust('MASTER', 0, 'DB')).toBeFalsy()
    })

    it('returns false when last segment is a triple', () => {
      expect(isBust('MASTER', 0, 'T20')).toBeFalsy()
      expect(isBust('MASTER', 0, 'T19')).toBeFalsy()
    })

    it('returns true when last segment is a single', () => {
      expect(isBust('MASTER', 0, 'S20')).toBeTruthy()
      expect(isBust('MASTER', 0, 'SB')).toBeTruthy()
    })
  })

  describe('when remaining is 0 with STRAIGHT out', () => {
    it('returns false regardless of last segment', () => {
      expect(isBust('STRAIGHT', 0, 'S20')).toBeFalsy()
      expect(isBust('STRAIGHT', 0, 'D10')).toBeFalsy()
      expect(isBust('STRAIGHT', 0, 'T5')).toBeFalsy()
    })
  })

  describe('when remaining is 0 and lastSegment is undefined', () => {
    it('returns false', () => {
      expect(isBust('DOUBLE', 0, undefined)).toBeFalsy()
      expect(isBust('MASTER', 0, undefined)).toBeFalsy()
      expect(isBust('STRAIGHT', 0, undefined)).toBeFalsy()
    })
  })

  describe('when remaining is greater than 1', () => {
    it('returns false for any outType', () => {
      expect(isBust('DOUBLE', 60, 'T20')).toBeFalsy()
      expect(isBust('MASTER', 100, 'S20')).toBeFalsy()
      expect(isBust('STRAIGHT', 301, 'D10')).toBeFalsy()
    })
  })
})
