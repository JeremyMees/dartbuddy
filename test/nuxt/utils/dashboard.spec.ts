import { describe, expect, it } from 'vitest'
import {
  getMatchScoreTrend,
  getRatioPercentage,
  getWinLossDistribution,
} from '#server/utils/dashboard'

describe('Dashboard utils', () => {
  describe('getRatioPercentage', () => {
    it('should return the correct percentage', () => {
      const percentage = getRatioPercentage(8, 16)

      expect(percentage).toBe(50)
    })

    it('should return zero when divisor is zero', () => {
      const percentage = getRatioPercentage(5, 0)

      expect(percentage).toBe(0)
    })

    it('should round the percentage to the nearest integer', () => {
      const percentage = getRatioPercentage(1, 3)

      expect(percentage).toBe(33)
    })
  })

  describe('getMatchScoreTrend', () => {
    it('should return both match score trend series', () => {
      const games = [
        { threeDartAverage: 50, firstNineDartAverage: 60 },
        { threeDartAverage: 55, firstNineDartAverage: 62 },
      ]

      const trend = getMatchScoreTrend(games)

      expect(trend).toEqual([
        {
          label: '3-Dart Average',
          data: { M1: 50, M2: 55 },
        },
        {
          label: 'First 9-Dart Average',
          data: { M1: 60, M2: 62 },
        },
      ])
    })

    it('should return empty series data when there are no games', () => {
      const trend = getMatchScoreTrend([])

      expect(trend).toEqual([
        { label: '3-Dart Average', data: {} },
        { label: 'First 9-Dart Average', data: {} },
      ])
    })
  })

  describe('getWinLossDistribution', () => {
    it('should build win/loss distribution keyed by opponent', () => {
      const groupedResults = [
        { opponent: 'Alice', hasWon: true, _count: { _all: 3 } },
        { opponent: 'Alice', hasWon: false, _count: { _all: 1 } },
        { opponent: 'Bob', hasWon: false, _count: { _all: 2 } },
      ]

      const distribution = getWinLossDistribution(groupedResults)

      expect(distribution).toEqual([
        {
          label: 'Win/Loss Distribution',
          data: {
            'Won vs Alice': 3,
            'Lost vs Alice': 1,
            'Lost vs Bob': 2,
          },
        },
      ])
    })

    it('should return the expected shape for empty grouped results', () => {
      const distribution = getWinLossDistribution([])

      expect(distribution).toEqual([
        {
          label: 'Win/Loss Distribution',
          data: {},
        },
      ])
    })
  })
})
