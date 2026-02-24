import { describe, expect, it } from 'vitest'
import { getPlayerCurrentLegTurns } from '~/utils/player-utils'
import { gameFull, playerOne } from '~~/test/fixtures'

describe('getPlayerCurrentLegTurns', () => {
  it('returns the correct player turns', () => {
    const turns = getPlayerCurrentLegTurns(gameFull, playerOne.id)

    const playerTurns = turns.filter((t) => t.playerId === playerOne.id)

    expect(playerTurns.length).toBe(3)
  })

  it('returns an empty array for a non-existent player', () => {
    const turns = getPlayerCurrentLegTurns(gameFull, 'nonExistentPlayerId')

    expect(turns.length).toBe(0)
  })
})
