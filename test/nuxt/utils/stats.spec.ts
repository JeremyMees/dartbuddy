import { describe, expect, it } from 'vitest'

describe('Stat utils', () => {
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

      expect(distribution).toEqual({
        '10': 2,
        '20': 2,
        '30': 1,
      })
    })

    it('should return an empty object for an empty array', () => {
      const games: { score: number }[] = []

      const distribution = getScoreDistribution(games, 'score')

      expect(distribution).toEqual({})
    })
  })

  describe('getRecentGames', () => {
    it('should return the 5 most recent games', () => {
      const games = [
        { id: '1', createdAt: '2026-01-01' },
        { id: '2', createdAt: '2026-01-02' },
        { id: '3', createdAt: '2026-01-03' },
        { id: '4', createdAt: '2026-01-04' },
        { id: '5', createdAt: '2026-01-05' },
        { id: '6', createdAt: '2026-01-06' },
      ]

      const recentGames = getRecentGames(games)

      expect(recentGames).toEqual([
        { id: '6', createdAt: '2026-01-06' },
        { id: '5', createdAt: '2026-01-05' },
        { id: '4', createdAt: '2026-01-04' },
        { id: '3', createdAt: '2026-01-03' },
        { id: '2', createdAt: '2026-01-02' },
      ])
    })

    it('should return all games if there are fewer than 5', () => {
      const games = [
        { id: '1', createdAt: '2026-01-01' },
        { id: '2', createdAt: '2026-01-02' },
        { id: '3', createdAt: '2026-01-03' },
      ]

      const recentGames = getRecentGames(games)

      expect(recentGames).toEqual([
        { id: '3', createdAt: '2026-01-03' },
        { id: '2', createdAt: '2026-01-02' },
        { id: '1', createdAt: '2026-01-01' },
      ])
    })

    it('should return an empty array if there are no games', () => {
      const games: { id: string; createdAt: string }[] = []

      const recentGames = getRecentGames(games)

      expect(recentGames).toEqual([])
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

      expect(averages).toEqual({ '01/01/26': 20 })
    })

    it('should return correct averages for multiple dates', () => {
      const games = [
        { score: 10, createdAt: '2026-01-01' },
        { score: 20, createdAt: '2026-01-01' },
        { score: 30, createdAt: '2026-01-02' },
        { score: 40, createdAt: '2026-01-02' },
      ]

      const averages = getScoreAverageByDate(games, 'score')

      expect(averages).toEqual({ '01/01/26': 15, '02/01/26': 35 })
    })

    it('should return an empty object for an empty array', () => {
      const games: { score: number; createdAt: string }[] = []

      const averages = getScoreAverageByDate(games, 'score')

      expect(averages).toEqual({})
    })

    it('should handle Date objects in addition to string dates', () => {
      const games = [
        { score: 10, createdAt: new Date('2026-01-01') },
        { score: 20, createdAt: '2026-01-01' },
        { score: 30, createdAt: '2026-01-02' },
      ]

      const averages = getScoreAverageByDate(games, 'score')

      expect(averages).toEqual({ '01/01/26': 15, '02/01/26': 30 })
    })

    it('should skip NaN values when calculating averages', () => {
      const games = [
        { score: 10, createdAt: '2026-01-01' },
        { score: NaN, createdAt: '2026-01-01' },
        { score: 20, createdAt: '2026-01-01' },
      ]

      const averages = getScoreAverageByDate(games, 'score')

      expect(averages).toEqual({ '01/01/26': 15 })
    })

    it('should round averages to nearest integer', () => {
      const games = [
        { score: 10, createdAt: '2026-01-01' },
        { score: 11, createdAt: '2026-01-01' },
      ]

      const averages = getScoreAverageByDate(games, 'score')

      expect(averages).toEqual({ '01/01/26': 11 })
    })

    it('should handle a single game per date', () => {
      const games = [
        { score: 25, createdAt: '2026-01-01' },
        { score: 35, createdAt: '2026-01-02' },
      ]

      const averages = getScoreAverageByDate(games, 'score')

      expect(averages).toEqual({ '01/01/26': 25, '02/01/26': 35 })
    })

    it('should group games by formatted date correctly', () => {
      const games = [
        { score: 100, createdAt: '2026-01-01T10:00:00Z' },
        { score: 200, createdAt: '2026-01-01T15:30:00Z' },
        { score: 300, createdAt: '2026-01-01T20:45:00Z' },
      ]

      const averages = getScoreAverageByDate(games, 'score')

      expect(averages).toEqual({ '01/01/26': 200 })
    })

    it('should work with different field names', () => {
      const games = [
        { points: 50, createdAt: '2026-01-01' },
        { points: 100, createdAt: '2026-01-01' },
        { points: 75, createdAt: '2026-01-02' },
      ]

      const averages = getScoreAverageByDate(games, 'points')

      expect(averages).toEqual({ '01/01/26': 75, '02/01/26': 75 })
    })

    it('should maintain date order based on input', () => {
      const games = [
        { score: 10, createdAt: '2026-01-05' },
        { score: 20, createdAt: '2026-01-01' },
        { score: 30, createdAt: '2026-01-03' },
      ]

      const averages = getScoreAverageByDate(games, 'score')

      expect(Object.keys(averages)).toHaveLength(3)
      expect(averages).toHaveProperty('01/01/26')
      expect(averages).toHaveProperty('03/01/26')
      expect(averages).toHaveProperty('05/01/26')
    })
  })

  describe('getPercentage', () => {
    it('should return the correct percentage', () => {
      const items = [
        { hits: 5, thrown: 10 },
        { hits: 3, thrown: 5 },
        { hits: 0, thrown: 2 },
      ]

      const percentage = getPercentage(items, 'hits', 'thrown')

      expect(percentage).toBe(50)
    })

    it('should return zero when there are no items', () => {
      const items: { hits: number; thrown: number }[] = []

      const percentage = getPercentage(items, 'hits', 'thrown')

      expect(percentage).toBe(0)
    })

    it('should return zero when divisor sum is zero', () => {
      const items = [
        { hits: 5, thrown: 0 },
        { hits: 3, thrown: 0 },
      ]

      const percentage = getPercentage(items, 'hits', 'thrown')

      expect(percentage).toBe(0)
    })

    it('should round the percentage to the nearest integer', () => {
      const items = [
        { hits: 2, thrown: 4 },
        { hits: 4, thrown: 8 },
      ]

      const percentage = getPercentage(items, 'hits', 'thrown')

      expect(percentage).toBe(50)
    })
  })
})
