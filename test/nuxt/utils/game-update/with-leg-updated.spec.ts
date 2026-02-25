import { describe, expect, it } from 'vitest'
import { withLegUpdated } from '~/utils/game-update'
import { gameFull } from '~~/test/fixtures'

const targetLegId = '0569a779-3e23-4553-8c5a-144ed8feaa16'
const uniqueWinnerId = 'test-winner-id-unique'

describe('withLegUpdated', () => {
  it('should update the winnerId on the matching leg', () => {
    const result = withLegUpdated(gameFull, targetLegId, {
      winnerId: uniqueWinnerId,
    })
    const leg = result.sets
      .flatMap((s) => s.legs)
      .find((l) => l.id === targetLegId)

    expect(leg?.winnerId).toBe(uniqueWinnerId)
  })

  it('should update the endedAt on the matching leg', () => {
    const endedAt = new Date('2026-02-25T10:00:00.000Z')
    const result = withLegUpdated(gameFull, targetLegId, { endedAt })
    const leg = result.sets
      .flatMap((s) => s.legs)
      .find((l) => l.id === targetLegId)

    expect(leg?.endedAt).toEqual(endedAt)
  })

  it('should apply a partial update without touching unspecified fields', () => {
    const original = gameFull.sets
      .flatMap((s) => s.legs)
      .find((l) => l.id === targetLegId)!
    const result = withLegUpdated(gameFull, targetLegId, {
      winnerId: uniqueWinnerId,
    })
    const leg = result.sets
      .flatMap((s) => s.legs)
      .find((l) => l.id === targetLegId)

    expect(leg?.turns).toEqual(original.turns)
    expect(leg?.number).toBe(original.number)
  })

  it('should not update any other leg', () => {
    const result = withLegUpdated(gameFull, targetLegId, {
      winnerId: uniqueWinnerId,
    })
    const otherLegs = result.sets
      .flatMap((s) => s.legs)
      .filter((l) => l.id !== targetLegId)
    const wronglyUpdated = otherLegs.find((l) => l.winnerId === uniqueWinnerId)

    expect(wronglyUpdated).toBeUndefined()
  })

  it('should not mutate the original game', () => {
    const original = gameFull.sets
      .flatMap((s) => s.legs)
      .find((l) => l.id === targetLegId)!
    const originalWinnerId = original.winnerId

    withLegUpdated(gameFull, targetLegId, { winnerId: uniqueWinnerId })

    expect(original.winnerId).toBe(originalWinnerId)
  })
})
