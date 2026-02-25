import { describe, expect, it } from 'vitest'
import { withTurnRemoved } from '~/utils/game-update'
import { gameFull } from '~~/test/fixtures'

// A known turn in the active leg
const existingTurnId = '702d3b5b-6f06-476b-90bd-9dcc58c06a04'
const activeLegId = '0569a779-3e23-4553-8c5a-144ed8feaa16'

describe('withTurnRemoved', () => {
  it('should remove the turn with the given ID', () => {
    const result = withTurnRemoved(gameFull, existingTurnId)
    const allTurns = result.sets.flatMap((s) => s.legs).flatMap((l) => l.turns)

    expect(allTurns.some((t) => t.id === existingTurnId)).toBe(false)
  })

  it('should decrease the turn count of the target leg by one', () => {
    const original = gameFull.sets
      .flatMap((s) => s.legs)
      .find((l) => l.id === activeLegId)!
    const result = withTurnRemoved(gameFull, existingTurnId)
    const updated = result.sets
      .flatMap((s) => s.legs)
      .find((l) => l.id === activeLegId)

    expect(updated?.turns).toHaveLength(original.turns.length - 1)
  })

  it('should preserve all other turns', () => {
    const originalTurns = gameFull.sets
      .flatMap((s) => s.legs)
      .flatMap((l) => l.turns)
      .filter((t) => t.id !== existingTurnId)
      .map((t) => t.id)
    const result = withTurnRemoved(gameFull, existingTurnId)
    const resultTurnIds = result.sets
      .flatMap((s) => s.legs)
      .flatMap((l) => l.turns)
      .map((t) => t.id)

    for (const id of originalTurns) {
      expect(resultTurnIds).toContain(id)
    }
  })

  it('should return the game unchanged when the turn ID does not exist', () => {
    const result = withTurnRemoved(gameFull, 'non-existent-turn-id')

    const originalCount = gameFull.sets
      .flatMap((s) => s.legs)
      .flatMap((l) => l.turns).length
    const resultCount = result.sets
      .flatMap((s) => s.legs)
      .flatMap((l) => l.turns).length

    expect(resultCount).toBe(originalCount)
  })

  it('should not mutate the original game', () => {
    const originalCount = gameFull.sets
      .flatMap((s) => s.legs)
      .flatMap((l) => l.turns).length

    withTurnRemoved(gameFull, existingTurnId)

    const afterCount = gameFull.sets
      .flatMap((s) => s.legs)
      .flatMap((l) => l.turns).length

    expect(afterCount).toBe(originalCount)
  })
})
