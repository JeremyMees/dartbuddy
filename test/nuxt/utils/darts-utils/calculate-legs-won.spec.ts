import { describe, expect, it } from 'vitest'
import { calculateLegsWon } from '~/utils/darts-utils'
import { playerOne, playerTwo, gameFull } from '~~/test/fixtures'

describe('calculateLegsWon', () => {
  it('returns the correct number of legs won by the player', () => {
    const legsWonByPlayer1 = calculateLegsWon(gameFull, playerOne.id)
    const legsWonByPlayer2 = calculateLegsWon(gameFull, playerTwo.id)

    expect(legsWonByPlayer1.legs).toBe(2)
    expect(legsWonByPlayer1.totalLegsWon).toBe(3)
    expect(legsWonByPlayer2.legs).toBe(0)
    expect(legsWonByPlayer2.totalLegsWon).toBe(1)
  })
})
