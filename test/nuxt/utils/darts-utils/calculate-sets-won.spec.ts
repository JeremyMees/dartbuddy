import { describe, expect, it } from 'vitest'
import { calculateSetsWon } from '~/utils/darts-utils'
import { playerOne, playerTwo, gameFull } from '~~/test/fixtures'

describe('calculateSetsWon', () => {
  it('should return the correct number of sets won by the player', () => {
    const setsWonByPlayer1 = calculateSetsWon(gameFull, playerOne.id)
    const setsWonByPlayer2 = calculateSetsWon(gameFull, playerTwo.id)

    expect(setsWonByPlayer1).toBe(1)
    expect(setsWonByPlayer2).toBe(0)
  })
})
