import { describe, expect, it } from 'vitest'
import { getPlayerWithLeastThrows } from '~/utils/player-utils'

function createMockStats(playerId: string, thrown: number): PlayerStats {
  return {
    playerId,
    thrown,
    firstName: 'Test',
    lastName: 'Player',
    nickName: 'Foo',
    sets: 0,
    legs: 0,
    totalLegsWon: 0,
    points: 501,
    average: 0,
    highestTurn: 0,
    oneEighties: 0,
    highestCheckout: 0,
    checkoutAttempts: 0,
    checkoutSuccesses: 0,
    busts: 0,
  }
}

describe('getPlayerWithLeastThrows', () => {
  it('returns the correct player with least throws', () => {
    const stats = [
      createMockStats('player-one', 10),
      createMockStats('player-two', 5),
      createMockStats('player-three', 8),
    ]

    const playerWithLeastThrows = getPlayerWithLeastThrows(stats)

    expect(playerWithLeastThrows).toBe('player-two')
  })

  it('returns undefined when stats array is empty', () => {
    expect(getPlayerWithLeastThrows([])).toBeUndefined()
  })

  it('returns the only player when there is one', () => {
    const stats = [createMockStats('player-one', 3)]

    expect(getPlayerWithLeastThrows(stats)).toBe('player-one')
  })

  it('returns the first player when there is a tie', () => {
    const stats = [
      createMockStats('player-one', 3),
      createMockStats('player-two', 3),
    ]

    expect(getPlayerWithLeastThrows(stats)).toBe('player-one')
  })
})
