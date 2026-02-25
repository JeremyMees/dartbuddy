import { describe, expect, it } from 'vitest'
import { withTurnAdded } from '~/utils/game-update'
import { gameFull, playerTwo } from '~~/test/fixtures'

const activeLegId = '0569a779-3e23-4553-8c5a-144ed8feaa16'

function makeTurn(overrides: Partial<GameTurn> = {}): GameTurn {
  return {
    id: 'new-turn-id',
    legId: activeLegId,
    playerId: playerTwo.id,
    startedAt: new Date('2026-02-25T10:00:00.000Z'),
    startingScore: 170,
    totalScored: 60,
    remainingScore: 110,
    isBust: false,
    _count: { throws: 3 },
    ...overrides,
  }
}

describe('withTurnAdded', () => {
  it('should append the turn to the matching leg', () => {
    const turn = makeTurn()
    const result = withTurnAdded(gameFull, activeLegId, turn)
    const leg = result.sets
      .flatMap((s) => s.legs)
      .find((l) => l.id === activeLegId)

    expect(leg?.turns.at(-1)).toEqual(turn)
  })

  it('should increase the turn count of the target leg by one', () => {
    const original = gameFull.sets
      .flatMap((s) => s.legs)
      .find((l) => l.id === activeLegId)
    const turn = makeTurn()
    const result = withTurnAdded(gameFull, activeLegId, turn)
    const updated = result.sets
      .flatMap((s) => s.legs)
      .find((l) => l.id === activeLegId)

    expect(updated?.turns).toHaveLength(original!.turns.length + 1)
  })

  it('should not add the turn to any other leg', () => {
    const turn = makeTurn()
    const result = withTurnAdded(gameFull, activeLegId, turn)
    const otherLegs = result.sets
      .flatMap((s) => s.legs)
      .filter((l) => l.id !== activeLegId)
    const leakingLeg = otherLegs.find((l) =>
      l.turns.some((t) => t.id === turn.id),
    )

    expect(leakingLeg).toBeUndefined()
  })

  it('should not mutate the original game', () => {
    const originalCount = gameFull.sets
      .flatMap((s) => s.legs)
      .find((l) => l.id === activeLegId)!.turns.length

    withTurnAdded(gameFull, activeLegId, makeTurn())

    const afterCount = gameFull.sets
      .flatMap((s) => s.legs)
      .find((l) => l.id === activeLegId)!.turns.length

    expect(afterCount).toBe(originalCount)
  })
})
