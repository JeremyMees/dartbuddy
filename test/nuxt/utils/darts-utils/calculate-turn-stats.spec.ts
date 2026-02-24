import { describe, expect, it } from 'vitest'
import { calculateTurnStats } from '~/utils/darts-utils'
import { unfinishedSet } from '~~/test/fixtures'

const currentLegTurns = unfinishedSet.legs.at(-1)?.turns ?? []

describe('calculateTurnStats', () => {
  it('should return the correct turn stats for the player', () => {
    const stats = calculateTurnStats(currentLegTurns)

    expect(stats.highestTurn).toBe(180)
    expect(stats.oneEighties).toBe(1)
    expect(stats.checkoutAttempts).toBe(1)
    expect(stats.checkoutSuccesses).toBe(1)
    expect(stats.highestCheckout).toBe(170)
    expect(stats.busts).toBe(1)
  })
})
