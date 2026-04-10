import { describe, expect, it } from 'vitest'

describe('Parse utils', () => {
  describe('parseChartDate', () => {
    it('should return a timestamp for a valid chart date label', () => {
      const parsedDate = parseChartDate('02/04/26')

      expect(Number.isNaN(parsedDate)).toBeFalsy()
    })

    it('should return NaN for an invalid chart date label', () => {
      const parsedDate = parseChartDate('test')

      expect(Number.isNaN(parsedDate)).toBeTruthy()
    })
  })

  describe('parseNumericLabel', () => {
    it('should return a number for a numeric label', () => {
      const value = parseNumericLabel('20')

      expect(value).toBe(20)
    })

    it('should return null for a non-numeric label', () => {
      const value = parseNumericLabel('twenty')

      expect(value).toBeNull()
    })
  })

  describe('sortEntriesByDate', () => {
    it('should sort entries by ascending chart date', () => {
      const entries: [string, number][] = [
        ['28/03/26', 30],
        ['26/03/26', 10],
        ['27/03/26', 20],
      ]

      const sortedEntries = entries.sort(sortEntriesByDate)

      expect(sortedEntries).toEqual([
        ['26/03/26', 10],
        ['27/03/26', 20],
        ['28/03/26', 30],
      ])
    })
  })

  describe('sortEntriesByNumericValue', () => {
    it('should sort entries by ascending numeric label', () => {
      const entries: [string, number][] = [
        ['20', 3],
        ['5', 1],
        ['10', 2],
      ]

      const sortedEntries = entries.sort(sortEntriesByNumericValue)

      expect(sortedEntries).toEqual([
        ['5', 1],
        ['10', 2],
        ['20', 3],
      ])
    })

    it('should return zero when one of the labels is not numeric', () => {
      const result = sortEntriesByNumericValue(['twenty', 1], ['10', 2])

      expect(result).toBe(0)
    })
  })

  describe('camelToKebab', () => {
    it('should convert camelCase to kebab-case', () => {
      const result = camelToKebab('scoreTraining')

      expect(result).toBe('score-training')
    })

    it('should return the same string if there are no uppercase letters', () => {
      const result = camelToKebab('scoring')

      expect(result).toBe('scoring')
    })

    it('should handle consecutive uppercase letters', () => {
      const result = camelToKebab('parseHTTPResponse')

      expect(result).toBe('parse-http-response')
    })

    it('should handle an empty string', () => {
      const result = camelToKebab('')

      expect(result).toBe('')
    })

    it('should handle a string with only uppercase letters', () => {
      const result = camelToKebab('HTTP')

      expect(result).toBe('http')
    })
  })

  describe('kebabToCamel', () => {
    it('should convert kebab-case to camelCase', () => {
      const result = kebabToCamel('score-training')

      expect(result).toBe('scoreTraining')
    })

    it('should return the same string if there are no hyphens', () => {
      const result = kebabToCamel('scoring')

      expect(result).toBe('scoring')
    })

    it('should handle multiple hyphens', () => {
      const result = kebabToCamel('parse-http-response')

      expect(result).toBe('parseHttpResponse')
    })

    it('should handle an empty string', () => {
      const result = kebabToCamel('')

      expect(result).toBe('')
    })

    it('should handle a string with only hyphens', () => {
      const result = kebabToCamel('---')

      expect(result).toBe('')
    })

    it('should handle a string with leading and trailing hyphens', () => {
      const result = kebabToCamel('-score-training-')

      expect(result).toBe('scoreTraining')
    })

    it('should handle a string with consecutive hyphens', () => {
      const result = kebabToCamel('score--training')

      expect(result).toBe('scoreTraining')
    })
  })
})
