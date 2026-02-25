import { describe, expect, it } from 'vitest'
import { withLegAdded } from '~/utils/game-update'
import { gameFull } from '~~/test/fixtures'

const targetSetId = '9dbd8b86-0fc1-4f37-864f-739502e81861'

function makeNewLeg(overrides: Partial<GameLeg> = {}): GameLeg {
  return {
    id: 'new-leg-id',
    setId: targetSetId,
    number: 4,
    createdAt: new Date('2026-02-25T10:00:00.000Z'),
    endedAt: null,
    winnerId: null,
    turns: [],
    ...overrides,
  }
}

describe('withLegAdded', () => {
  it('should append the leg to the matching set', () => {
    const leg = makeNewLeg()
    const result = withLegAdded(gameFull, targetSetId, leg)
    const set = result.sets.find((s) => s.id === targetSetId)

    expect(set?.legs.at(-1)).toEqual(leg)
  })

  it('should increase the leg count of the target set by one', () => {
    const originalCount = gameFull.sets.find((s) => s.id === targetSetId)!.legs
      .length
    const result = withLegAdded(gameFull, targetSetId, makeNewLeg())
    const set = result.sets.find((s) => s.id === targetSetId)

    expect(set?.legs).toHaveLength(originalCount + 1)
  })

  it('should not add the leg to any other set', () => {
    const leg = makeNewLeg()
    const result = withLegAdded(gameFull, targetSetId, leg)
    const otherSets = result.sets.filter((s) => s.id !== targetSetId)
    const leakingSet = otherSets.find((s) =>
      s.legs.some((l) => l.id === leg.id),
    )

    expect(leakingSet).toBeUndefined()
  })

  it('should preserve existing legs of the target set', () => {
    const originalLegIds = gameFull.sets
      .find((s) => s.id === targetSetId)!
      .legs.map((l) => l.id)
    const result = withLegAdded(gameFull, targetSetId, makeNewLeg())
    const resultLegIds = result.sets
      .find((s) => s.id === targetSetId)!
      .legs.map((l) => l.id)

    for (const id of originalLegIds) {
      expect(resultLegIds).toContain(id)
    }
  })

  it('should not mutate the original game', () => {
    const originalCount = gameFull.sets.find((s) => s.id === targetSetId)!.legs
      .length

    withLegAdded(gameFull, targetSetId, makeNewLeg())

    expect(gameFull.sets.find((s) => s.id === targetSetId)!.legs).toHaveLength(
      originalCount,
    )
  })
})
