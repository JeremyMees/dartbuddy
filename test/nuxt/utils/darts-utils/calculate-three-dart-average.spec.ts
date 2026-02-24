import { describe, expect, it } from 'vitest'
import { calculateThreeDartAverage } from '~/utils/darts-utils'
import { unfinishedSet } from '~~/test/fixtures'

const currentLegTurns = unfinishedSet.legs.at(-1)?.turns ?? []

describe('calculateThreeDartAverage', () => {
  it('returns the correct three-dart average for the player', () => {
    const average = calculateThreeDartAverage(currentLegTurns)

    expect(average).toBe(70)
  })

  it('returns 0 when there are no turns', () => {
    const average = calculateThreeDartAverage([])

    expect(average).toBe(0)
  })
})
