import { describe, expect, it } from 'vitest'
import { calculateCurrentPoints } from '~/utils/darts-utils'
import { unfinishedSet } from '~~/test/fixtures'

const currentLegTurns = unfinishedSet.legs.at(-1)?.turns ?? []

describe('calculateCurrentPoints', () => {
  it('should return the correct number of points for the player', () => {
    const points = calculateCurrentPoints(currentLegTurns, 501)

    expect(points).toBe(310)
  })

  it('should return the fallback value when there are no turns', () => {
    const points = calculateCurrentPoints([], 501)

    expect(points).toBe(501)
  })

  it('should return 0 when there are no turns and no fallback value is provided', () => {
    const points = calculateCurrentPoints([], 0)

    expect(points).toBe(0)
  })
})
