import { describe, expect, it } from 'vitest'
import { getPlayerTurns } from '~/utils/player-utils'
import { gameFull, playerOne } from '~~/test/fixtures'

describe('getPlayerTurns', () => {
  it('should return the correct player turns', () => {
    const turns = getPlayerTurns(gameFull, playerOne.id)

    const playerTurns = turns.filter((t) => t.playerId === playerOne.id)

    expect(playerTurns.length).toBe(turns.length)
  })

  it('should return an empty array for a non-existent player', () => {
    const turns = getPlayerTurns(gameFull, 'nonExistentPlayerId')

    expect(turns.length).toBe(0)
  })
})
