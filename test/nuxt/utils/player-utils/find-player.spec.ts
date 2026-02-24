import { describe, expect, it } from 'vitest'
import { findPlayer } from '~/utils/player-utils'
import { gameFull, playerOne } from '~~/test/fixtures'

describe('findPlayer', () => {
  it('returns the correct player', () => {
    const player = findPlayer(gameFull, playerOne.id)

    expect(player).toBeDefined()
    expect(player).toBe(playerOne)
  })

  it('returns null for a non-existent player', () => {
    const player = findPlayer(gameFull, 'nonExistentPlayerId')

    expect(player).toBe(null)
  })
})
