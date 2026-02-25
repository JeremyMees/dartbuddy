import { describe, expect, it } from 'vitest'
import { withSetUpdated } from '~/utils/game-update'
import { gameFull } from '~~/test/fixtures'

const targetSetId = '9dbd8b86-0fc1-4f37-864f-739502e81861'
const uniqueWinnerId = 'test-winner-id-unique'

describe('withSetUpdated', () => {
  it('should update the winnerId on the matching set', () => {
    const result = withSetUpdated(gameFull, targetSetId, {
      winnerId: uniqueWinnerId,
    })
    const set = result.sets.find((s) => s.id === targetSetId)

    expect(set?.winnerId).toBe(uniqueWinnerId)
  })

  it('should update the endedAt on the matching set', () => {
    const endedAt = new Date('2026-02-25T10:00:00.000Z')
    const result = withSetUpdated(gameFull, targetSetId, { endedAt })
    const set = result.sets.find((s) => s.id === targetSetId)

    expect(set?.endedAt).toEqual(endedAt)
  })

  it('should apply a partial update without touching unspecified fields', () => {
    const original = gameFull.sets.find((s) => s.id === targetSetId)!
    const result = withSetUpdated(gameFull, targetSetId, {
      winnerId: uniqueWinnerId,
    })
    const set = result.sets.find((s) => s.id === targetSetId)

    expect(set?.legs).toEqual(original.legs)
    expect(set?.number).toBe(original.number)
  })

  it('should not update any other set', () => {
    const result = withSetUpdated(gameFull, targetSetId, {
      winnerId: uniqueWinnerId,
    })
    const otherSets = result.sets.filter((s) => s.id !== targetSetId)
    const wronglyUpdated = otherSets.find((s) => s.winnerId === uniqueWinnerId)

    expect(wronglyUpdated).toBeUndefined()
  })

  it('should not mutate the original game', () => {
    const original = gameFull.sets.find((s) => s.id === targetSetId)!
    const originalWinnerId = original.winnerId

    withSetUpdated(gameFull, targetSetId, { winnerId: uniqueWinnerId })

    expect(original.winnerId).toBe(originalWinnerId)
  })
})
