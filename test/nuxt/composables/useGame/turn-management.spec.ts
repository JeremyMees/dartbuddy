import { beforeEach, describe, expect, it, vi } from 'vitest'
import { mockNuxtImport } from '@nuxt/test-utils/runtime'
import { gameFull, playerTwo } from '~~/test/fixtures'

const { routeParamsMock, useLazyAsyncDataMock, fetchMock, cachedGameValue } =
  vi.hoisted(() => {
    const cachedGameValue = { value: null as GameFull | null }
    return {
      routeParamsMock: vi.fn(),
      useLazyAsyncDataMock: vi.fn(),
      fetchMock: vi.fn(),
      cachedGameValue,
    }
  })

mockNuxtImport('useRoute', () => {
  return () => ({
    params: routeParamsMock(),
  })
})

mockNuxtImport('useNuxtData', () => {
  return (_key: string) => ({
    data: cachedGameValue,
  })
})

mockNuxtImport('useLazyAsyncData', () => {
  return useLazyAsyncDataMock
})

vi.stubGlobal('$fetch', fetchMock)

describe('useGame - turn management', () => {
  const currentLegId = gameFull.sets[1]?.legs[0]?.id ?? ''

  beforeEach(() => {
    vi.clearAllMocks()

    cachedGameValue.value = { ...gameFull }
    routeParamsMock.mockReturnValue({ id: gameFull.id })
    useLazyAsyncDataMock.mockReturnValue({
      data: ref(gameFull),
      pending: ref(false),
      error: ref(null),
      refresh: vi.fn(),
    })
    fetchMock.mockImplementation(async (_url, options) => {
      if (options?.onRequest) {
        options.onRequest()
      }

      return {}
    })
  })

  describe('addTurn', () => {
    it('should add a turn with correct data', async () => {
      const { addTurn } = useGame()

      const turnData = {
        legId: currentLegId,
        playerId: playerTwo.id,
        startingScore: 501,
        throws: [
          { segment: 'TRIPLE_20', scored: 60 },
          { segment: 'TRIPLE_20', scored: 60 },
          { segment: 'SINGLE_13', scored: 13 },
        ],
      }

      await addTurn(turnData)

      expect(fetchMock).toHaveBeenCalledWith(
        `/api/games/${gameFull.id}/turns`,
        expect.objectContaining({
          method: 'POST',
          body: turnData,
        }),
      )
    })

    it('should add a bust turn', async () => {
      const { addTurn } = useGame()

      const turnData = {
        legId: currentLegId,
        playerId: playerTwo.id,
        startingScore: 50,
        throws: [{ segment: 'TRIPLE_20', scored: 60 }],
        isBust: true,
      }

      await addTurn(turnData)

      expect(fetchMock).toHaveBeenCalledWith(
        `/api/games/${gameFull.id}/turns`,
        expect.objectContaining({
          method: 'POST',
          body: turnData,
        }),
      )
    })

    it('should not add turn if cachedGame is not available', async () => {
      cachedGameValue.value = null

      const { addTurn } = useGame()

      await addTurn({
        legId: currentLegId,
        playerId: playerTwo.id,
        startingScore: 501,
        throws: [],
      })

      expect(fetchMock).not.toHaveBeenCalled()
    })

    it('should not add turn if player not found', async () => {
      const { addTurn } = useGame()

      await addTurn({
        legId: currentLegId,
        playerId: 'non-existent-player',
        startingScore: 501,
        throws: [],
      })

      expect(fetchMock).not.toHaveBeenCalled()
    })
  })

  describe('undoLastTurn', () => {
    it('should delete the last turn', async () => {
      const lastTurn = gameFull.sets.at(-1)?.legs.at(-1)?.turns.at(-1) ?? {
        id: 'unknown',
      }
      const { undoLastTurn } = useGame()

      await undoLastTurn()

      expect(fetchMock).toHaveBeenCalledWith(
        `/api/games/${gameFull.id}/turns/${lastTurn.id}`,
        expect.objectContaining({
          method: 'DELETE',
        }),
      )
    })

    it('should set active player to the player who made last turn', async () => {
      const lastTurn = gameFull.sets.at(-1)?.legs.at(-1)?.turns.at(-1) ?? {
        playerId: playerTwo.id,
      }
      const { undoLastTurn } = useGame()

      await undoLastTurn()

      expect(fetchMock).toHaveBeenCalledWith(
        `/api/games/${gameFull.id}`,
        expect.objectContaining({
          method: 'PATCH',
          body: { activePlayerId: lastTurn.playerId },
        }),
      )
    })

    it('should not undo if game is not loaded', async () => {
      useLazyAsyncDataMock.mockReturnValue({
        data: ref(null),
        pending: ref(false),
        error: ref(null),
        refresh: vi.fn(),
      })

      const { undoLastTurn } = useGame()

      await undoLastTurn()

      expect(fetchMock).not.toHaveBeenCalled()
    })

    it('should not undo if there are no turns', async () => {
      const gameWithoutTurns = {
        ...gameFull,
        sets: [
          {
            ...gameFull.sets[0],
            legs: [{ ...gameFull.sets[0]?.legs[0], turns: [] }],
          },
        ],
      }

      useLazyAsyncDataMock.mockReturnValue({
        data: ref(gameWithoutTurns),
        pending: ref(false),
        error: ref(null),
        refresh: vi.fn(),
      })

      const { undoLastTurn } = useGame()

      await undoLastTurn()

      expect(fetchMock).not.toHaveBeenCalled()
    })
  })
})
