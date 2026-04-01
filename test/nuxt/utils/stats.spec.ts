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
})
