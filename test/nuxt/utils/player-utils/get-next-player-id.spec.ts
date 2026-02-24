import { describe, expect, it } from 'vitest'
import { getNextPlayerId } from '~/utils/player-utils'
import { playerOne } from '~~/test/fixtures'

function createMockGame(
  players: string[],
  activePlayerId: string,
): Partial<GameFull> {
  return {
    activePlayerId,
    players: players.map((playerId) => ({
      id: `game-player-${playerId}`,
      gameId: 'mock-game-id',
      playerId,
      seatOrder: 0,
      setsWon: 0,
      player: playerOne,
    })),
  } as GameFull
}

describe('getNextPlayerId', () => {
  it('returns the next player in sequence', () => {
    const game = createMockGame(
      ['player-one', 'player-two', 'player-three'],
      'player-one',
    )

    expect(getNextPlayerId(game as GameFull)).toBe('player-two')
  })

  it('wraps around to first player when current player is last', () => {
    const game = createMockGame(
      ['player-one', 'player-two', 'player-three'],
      'player-three',
    )

    expect(getNextPlayerId(game as GameFull)).toBe('player-one')
  })

  it('returns undefined when active player is not in players array', () => {
    const game = createMockGame(
      ['player-one', 'player-two'],
      'non-existent-player',
    )

    expect(getNextPlayerId(game as GameFull)).toBeUndefined()
  })

  it('wraps to itself when there is only one player', () => {
    const game = createMockGame(['solo-player'], 'solo-player')

    expect(getNextPlayerId(game as GameFull)).toBe('solo-player')
  })

  it('alternates correctly between two players', () => {
    const game = createMockGame(['player-one', 'player-two'], 'player-two')

    expect(getNextPlayerId(game as GameFull)).toBe('player-one')
  })
})
