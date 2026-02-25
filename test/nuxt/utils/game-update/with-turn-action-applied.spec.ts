import { describe, expect, it } from 'vitest'
import { withTurnActionApplied } from '~/utils/game-update'
import { gameFull, playerOne, playerTwo } from '~~/test/fixtures'

const activeSetId = '9dbd8b86-0fc1-4f37-864f-739502e81861'
const activeLegId = '0569a779-3e23-4553-8c5a-144ed8feaa16'

function makeTurn(overrides: Partial<GameTurn> = {}): GameTurn {
  return {
    id: 'new-turn-id',
    legId: activeLegId,
    playerId: playerTwo.id,
    startedAt: new Date('2026-02-25T10:00:00.000Z'),
    startingScore: 170,
    totalScored: 100,
    remainingScore: 70,
    isBust: false,
    _count: { throws: 3 },
    ...overrides,
  }
}

describe('withTurnActionApplied', () => {
  it('should append the optimistic turn to the correct leg', () => {
    const turn = makeTurn()
    const result = withTurnActionApplied(gameFull, { legId: activeLegId }, turn)

    const leg = result.sets
      .flatMap((s) => s.legs)
      .find((l) => l.id === activeLegId)

    expect(leg?.turns.at(-1)).toEqual(turn)
  })

  it('should not add the turn to any other leg', () => {
    const turn = makeTurn()
    const result = withTurnActionApplied(gameFull, { legId: activeLegId }, turn)
    const otherLegs = result.sets
      .flatMap((s) => s.legs)
      .filter((l) => l.id !== activeLegId)
    const leakingLeg = otherLegs.find((l) =>
      l.turns.some((t) => t.id === turn.id),
    )

    expect(leakingLeg).toBeUndefined()
  })

  it('should apply legUpdate when provided', () => {
    const turn = makeTurn()
    const result = withTurnActionApplied(
      gameFull,
      {
        legId: activeLegId,
        legUpdate: {
          legId: activeLegId,
          winnerId: playerTwo.id,
          endedAt: '2026-02-25T10:00:00.000Z',
        },
      },
      turn,
    )
    const leg = result.sets
      .flatMap((s) => s.legs)
      .find((l) => l.id === activeLegId)

    expect(leg?.winnerId).toBe(playerTwo.id)
    expect(leg?.endedAt).toEqual(new Date('2026-02-25T10:00:00.000Z'))
  })

  it('should apply setUpdate when provided', () => {
    const turn = makeTurn()
    const result = withTurnActionApplied(
      gameFull,
      {
        legId: activeLegId,
        setUpdate: {
          setId: activeSetId,
          winnerId: playerTwo.id,
          endedAt: '2026-02-25T10:00:00.000Z',
        },
      },
      turn,
    )
    const set = result.sets.find((s) => s.id === activeSetId)

    expect(set?.winnerId).toBe(playerTwo.id)
    expect(set?.endedAt).toEqual(new Date('2026-02-25T10:00:00.000Z'))
  })

  it('should add a new leg with a temp ID when newLeg is provided', () => {
    const turn = makeTurn()
    const originalLegCount = gameFull.sets[0]!.legs.length
    const result = withTurnActionApplied(
      gameFull,
      {
        legId: activeLegId,
        newLeg: { setId: activeSetId, number: originalLegCount + 1 },
      },
      turn,
    )
    const set = result.sets.find((s) => s.id === activeSetId)

    expect(set?.legs).toHaveLength(originalLegCount + 1)

    const newLeg = set?.legs.at(-1)

    expect(newLeg?.id).toMatch(/^temp-leg-/)
    expect(newLeg?.number).toBe(originalLegCount + 1)
    expect(newLeg?.turns).toEqual([])
  })

  it('should add a new set with a first leg when newSet is provided', () => {
    const turn = makeTurn()
    const result = withTurnActionApplied(
      gameFull,
      { legId: activeLegId, newSet: { number: gameFull.sets.length + 1 } },
      turn,
    )

    expect(result.sets).toHaveLength(gameFull.sets.length + 1)

    const newSet = result.sets.at(-1)

    expect(newSet?.id).toMatch(/^temp-set-/)
    expect(newSet?.number).toBe(gameFull.sets.length + 1)
    expect(newSet?.legs).toHaveLength(1)
    expect(newSet?.legs[0]?.number).toBe(1)
    expect(newSet?.legs[0]?.turns).toEqual([])
  })

  it('should apply activePlayerId from gameUpdate and resolve the player object', () => {
    const turn = makeTurn()
    const result = withTurnActionApplied(
      gameFull,
      { legId: activeLegId, gameUpdate: { activePlayerId: playerOne.id } },
      turn,
    )

    expect(result.activePlayerId).toBe(playerOne.id)
    expect(result.activePlayer).toBe(playerOne)
  })

  it('should apply winnerId from gameUpdate and resolve the winner object', () => {
    const turn = makeTurn()
    const result = withTurnActionApplied(
      gameFull,
      {
        legId: activeLegId,
        gameUpdate: {
          winnerId: playerTwo.id,
          completedAt: '2026-02-25T10:00:00.000Z',
          endReason: 'COMPLETED',
        },
      },
      turn,
    )

    expect(result.winnerId).toBe(playerTwo.id)
    expect(result.winner).toBe(playerTwo)
    expect(result.completedAt).toEqual(new Date('2026-02-25T10:00:00.000Z'))
    expect(result.endReason).toBe('COMPLETED')
  })

  it('should set winner to null when gameUpdate.winnerId is null', () => {
    const gameWithWinner = {
      ...gameFull,
      winnerId: playerOne.id,
      winner: playerOne,
    }
    const turn = makeTurn()
    const result = withTurnActionApplied(
      gameWithWinner as GameFull,
      { legId: activeLegId, gameUpdate: { winnerId: null } },
      turn,
    )

    expect(result.winnerId).toBeNull()
    expect(result.winner).toBeNull()
  })

  it('should not mutate the original game', () => {
    const turn = makeTurn()
    const originalTurnCount = gameFull.sets.flatMap((s) =>
      s.legs.flatMap((l) => l.turns),
    ).length

    withTurnActionApplied(
      gameFull,
      { legId: activeLegId, newLeg: { setId: activeSetId, number: 99 } },
      turn,
    )

    const afterTurnCount = gameFull.sets.flatMap((s) =>
      s.legs.flatMap((l) => l.turns),
    ).length

    expect(afterTurnCount).toBe(originalTurnCount)
    expect(gameFull.sets[0]!.legs).toHaveLength(3)
  })
})
