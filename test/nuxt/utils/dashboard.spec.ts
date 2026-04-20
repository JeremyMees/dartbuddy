import { describe, expect, it } from 'vitest'
import {
  getAverage,
  getBestGame,
  getHighest,
  getMatchScoreTrend,
  getRatioPercentage,
  getScoreAverageByDate,
  getScoreDistribution,
  getTrendDirection,
  getWinLossDistribution,
} from '#server/utils/dashboard'

describe('Dashboard utils', () => {
  describe('getTrendDirection', () => {
    it('should return normal with zero change for fewer than 2 items', () => {
      const items = [{ value: 10, createdAt: '2026-01-01' }]

      const result = getTrendDirection(items, 'value')

      expect(result).toEqual({ direction: 'normal', change: 0 })
    })

    it('should return normal with zero change for an empty array', () => {
      const items: { value: number; createdAt: string }[] = []

      const result = getTrendDirection(items, 'value')

      expect(result).toEqual({ direction: 'normal', change: 0 })
    })

    it('should return up when newer values are higher', () => {
      const items = [
        { value: 10, createdAt: '2026-01-01' },
        { value: 20, createdAt: '2026-01-02' },
        { value: 30, createdAt: '2026-01-03' },
        { value: 40, createdAt: '2026-01-04' },
      ]

      const result = getTrendDirection(items, 'value')

      expect(result.direction).toBe('up')
      expect(result.change).toBeGreaterThan(0)
    })

    it('should return down when newer values are lower', () => {
      const items = [
        { value: 40, createdAt: '2026-01-01' },
        { value: 30, createdAt: '2026-01-02' },
        { value: 20, createdAt: '2026-01-03' },
        { value: 10, createdAt: '2026-01-04' },
      ]

      const result = getTrendDirection(items, 'value')

      expect(result.direction).toBe('down')
      expect(result.change).toBeLessThan(0)
    })

    it('should return normal when values are equal', () => {
      const items = [
        { value: 10, createdAt: '2026-01-01' },
        { value: 10, createdAt: '2026-01-02' },
        { value: 10, createdAt: '2026-01-03' },
        { value: 10, createdAt: '2026-01-04' },
      ]

      const result = getTrendDirection(items, 'value')

      expect(result).toEqual({ direction: 'normal', change: 0 })
    })

    it('should sort items by createdAt regardless of input order', () => {
      const items = [
        { value: 40, createdAt: '2026-01-04' },
        { value: 10, createdAt: '2026-01-01' },
        { value: 30, createdAt: '2026-01-03' },
        { value: 20, createdAt: '2026-01-02' },
      ]

      const result = getTrendDirection(items, 'value')

      expect(result.direction).toBe('up')
      expect(result.change).toBeGreaterThan(0)
    })

    it('should return up with 100% change when older half averages zero', () => {
      const items = [
        { value: 0, createdAt: '2026-01-01' },
        { value: 0, createdAt: '2026-01-02' },
        { value: 10, createdAt: '2026-01-03' },
        { value: 20, createdAt: '2026-01-04' },
      ]

      const result = getTrendDirection(items, 'value')

      expect(result).toEqual({ direction: 'up', change: 100 })
    })

    it('should return normal when both halves average zero', () => {
      const items = [
        { value: 0, createdAt: '2026-01-01' },
        { value: 0, createdAt: '2026-01-02' },
        { value: 0, createdAt: '2026-01-03' },
        { value: 0, createdAt: '2026-01-04' },
      ]

      const result = getTrendDirection(items, 'value')

      expect(result).toEqual({ direction: 'normal', change: 0 })
    })

    it('should calculate the correct percentage change', () => {
      const items = [
        { value: 50, createdAt: '2026-01-01' },
        { value: 50, createdAt: '2026-01-02' },
        { value: 75, createdAt: '2026-01-03' },
        { value: 75, createdAt: '2026-01-04' },
      ]

      const result = getTrendDirection(items, 'value')

      expect(result).toEqual({ direction: 'up', change: 50 })
    })
  })

  describe('getAverage', () => {
    it('should return the correct average', async () => {
      const items = [{ value: 10 }, { value: 20 }, { value: 30 }]

      const average = getAverage(items, 'value')

      expect(average).toBe(20)
    })

    it('should return zero for an empty array', async () => {
      const items: { value: number }[] = []

      const average = getAverage(items, 'value')

      expect(average).toBe(0)
    })

    it('should return zero when the key value is not a number', async () => {
      const items: { value: string }[] = [
        { value: 'a' },
        { value: 'b' },
        { value: 'c' },
      ]

      const average = getAverage(items, 'value')

      expect(average).toBe(0)
    })
  })

  describe('getHighest', () => {
    it('should return the highest value', async () => {
      const items = [{ value: 10 }, { value: 20 }, { value: 30 }]

      const highest = getHighest(items, 'value')

      expect(highest).toBe(30)
    })

    it('should return zero for an empty array', async () => {
      const items: { value: number }[] = []

      const highest = getHighest(items, 'value')

      expect(highest).toBe(0)
    })

    it('should return zero when the key value is not a number', async () => {
      const items: { value: string }[] = [
        { value: 'a' },
        { value: 'b' },
        { value: 'c' },
      ]

      const highest = getHighest(items, 'value')

      expect(highest).toBe(0)
    })
  })

  describe('getBestGame', () => {
    it('should return the game with the highest score', () => {
      const games = [
        { score: 10, id: '1' },
        { score: 20, id: '2' },
        { score: 15, id: '3' },
      ]

      const bestGame = getBestGame(games, 'score')

      expect(bestGame).toEqual({ score: 20, id: '2' })
    })

    it('should return null for an empty array', () => {
      const games: { score: number; id: string }[] = []

      const bestGame = getBestGame(games, 'score')

      expect(bestGame).toBeNull()
    })
  })

  describe('getScoreDistribution', () => {
    it('should return the correct score distribution', () => {
      const games = [
        { score: 10 },
        { score: 20 },
        { score: 10 },
        { score: 30 },
        { score: 20 },
      ]

      const distribution = getScoreDistribution(games, 'score')

      expect(distribution).toHaveLength(1)
      expect(distribution[0]?.label).toBe('Score Distribution')
      expect(distribution[0]?.data).toEqual({
        '10': 2,
        '20': 2,
        '30': 1,
      })
      expect(distribution[0]?.sort).toBeTypeOf('function')
    })

    it('should return an empty object for an empty array', () => {
      const games: { score: number }[] = []

      const distribution = getScoreDistribution(games, 'score')

      expect(distribution).toEqual([])
    })
  })

  describe('getScoreAverageByDate', () => {
    it('should return correct averages for a single date with multiple scores', () => {
      const games = [
        { score: 10, createdAt: '2026-01-01' },
        { score: 20, createdAt: '2026-01-01' },
        { score: 30, createdAt: '2026-01-01' },
      ]

      const averages = getScoreAverageByDate(games, 'score')

      expect(averages).toEqual([
        { label: 'Score Trend', data: { '01/01/26': 20 } },
      ])
    })

    it('should return correct averages for multiple dates', () => {
      const games = [
        { score: 10, createdAt: '2026-01-01' },
        { score: 20, createdAt: '2026-01-01' },
        { score: 30, createdAt: '2026-01-02' },
        { score: 40, createdAt: '2026-01-02' },
      ]

      const averages = getScoreAverageByDate(games, 'score')

      expect(averages).toEqual([
        { label: 'Score Trend', data: { '01/01/26': 15, '02/01/26': 35 } },
      ])
    })

    it('should return an empty object for an empty array', () => {
      const games: { score: number; createdAt: string }[] = []

      const averages = getScoreAverageByDate(games, 'score')

      expect(averages).toEqual([])
    })

    it('should handle Date objects in addition to string dates', () => {
      const games = [
        { score: 10, createdAt: new Date('2026-01-01') },
        { score: 20, createdAt: '2026-01-01' },
        { score: 30, createdAt: '2026-01-02' },
      ]

      const averages = getScoreAverageByDate(games, 'score')

      expect(averages).toEqual([
        { label: 'Score Trend', data: { '01/01/26': 15, '02/01/26': 30 } },
      ])
    })

    it('should skip NaN values when calculating averages', () => {
      const games = [
        { score: 10, createdAt: '2026-01-01' },
        { score: NaN, createdAt: '2026-01-01' },
        { score: 20, createdAt: '2026-01-01' },
      ]

      const averages = getScoreAverageByDate(games, 'score')

      expect(averages).toEqual([
        { label: 'Score Trend', data: { '01/01/26': 15 } },
      ])
    })

    it('should round averages to nearest integer', () => {
      const games = [
        { score: 10, createdAt: '2026-01-01' },
        { score: 11, createdAt: '2026-01-01' },
      ]

      const averages = getScoreAverageByDate(games, 'score')

      expect(averages).toEqual([
        { label: 'Score Trend', data: { '01/01/26': 11 } },
      ])
    })

    it('should handle a single game per date', () => {
      const games = [
        { score: 25, createdAt: '2026-01-01' },
        { score: 35, createdAt: '2026-01-02' },
      ]

      const averages = getScoreAverageByDate(games, 'score')

      expect(averages).toEqual([
        { label: 'Score Trend', data: { '01/01/26': 25, '02/01/26': 35 } },
      ])
    })

    it('should group games by formatted date correctly', () => {
      const games = [
        { score: 100, createdAt: '2026-01-01T10:00:00Z' },
        { score: 200, createdAt: '2026-01-01T15:30:00Z' },
        { score: 300, createdAt: '2026-01-01T20:45:00Z' },
      ]

      const averages = getScoreAverageByDate(games, 'score')

      expect(averages).toEqual([
        { label: 'Score Trend', data: { '01/01/26': 200 } },
      ])
    })

    it('should work with different field names', () => {
      const games = [
        { points: 50, createdAt: '2026-01-01' },
        { points: 100, createdAt: '2026-01-01' },
        { points: 75, createdAt: '2026-01-02' },
      ]

      const averages = getScoreAverageByDate(games, 'points')

      expect(averages).toEqual([
        { label: 'Score Trend', data: { '01/01/26': 75, '02/01/26': 75 } },
      ])
    })

    it('should maintain date order based on input', () => {
      const games = [
        { score: 10, createdAt: '2026-01-05' },
        { score: 20, createdAt: '2026-01-01' },
        { score: 30, createdAt: '2026-01-03' },
      ]

      const averages = getScoreAverageByDate(games, 'score')

      expect(averages).toEqual([
        {
          label: 'Score Trend',
          data: {
            '01/01/26': 20,
            '03/01/26': 30,
            '05/01/26': 10,
          },
        },
      ])
    })
  })

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
