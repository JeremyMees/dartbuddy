import { describe, expect, it } from 'vitest'

describe('Stat utils', () => {
  describe('generateAveragePercent', () => {
    it('should return the correct average', async () => {
      const items = [{ value: 10 }, { value: 20 }, { value: 30 }]

      const average = generateAveragePercent(items, 'value')

      expect(average).toBe(20)
    })

    it('should return zero for an empty array', async () => {
      const items: { value: number }[] = []

      const average = generateAveragePercent(items, 'value')

      expect(average).toBe(0)
    })

    it('should return zero when the key value is not a number', async () => {
      const items: { value: string }[] = [
        { value: 'a' },
        { value: 'b' },
        { value: 'c' },
      ]

      const average = generateAveragePercent(items, 'value')

      expect(average).toBe(0)
    })
  })
})
