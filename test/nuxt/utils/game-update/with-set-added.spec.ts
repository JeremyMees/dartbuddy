import { describe, expect, it } from 'vitest'
import { withSetAdded } from '~/utils/game-update'
import { gameFull } from '~~/test/fixtures'

function makeNewSet(): GameSet {
  return {
    id: 'new-set-id',
    gameId: gameFull.id,
    number: gameFull.sets.length + 1,
    createdAt: new Date('2026-02-25T10:00:00.000Z'),
    endedAt: null,
    winnerId: null,
    legs: [
      {
        id: 'new-leg-id',
        setId: 'new-set-id',
        number: 1,
        createdAt: new Date('2026-02-25T10:00:00.000Z'),
        endedAt: null,
        winnerId: null,
        turns: [],
      },
    ],
  }
}

describe('withSetAdded', () => {
  it('should append the set to the game', () => {
    const set = makeNewSet()
    const result = withSetAdded(gameFull, set)

    expect(result.sets.at(-1)).toEqual(set)
  })

  it('should increase the set count by one', () => {
    const result = withSetAdded(gameFull, makeNewSet())

    expect(result.sets).toHaveLength(gameFull.sets.length + 1)
  })

  it('should preserve all existing sets', () => {
    const originalSetIds = gameFull.sets.map((s) => s.id)
    const result = withSetAdded(gameFull, makeNewSet())
    const resultSetIds = result.sets.map((s) => s.id)

    for (const id of originalSetIds) {
      expect(resultSetIds).toContain(id)
    }
  })

  it('should not mutate the original game', () => {
    const originalCount = gameFull.sets.length

    withSetAdded(gameFull, makeNewSet())

    expect(gameFull.sets).toHaveLength(originalCount)
  })
})
