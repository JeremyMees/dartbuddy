import { beforeEach, describe, expect, it, vi } from 'vitest'
import { mockNuxtImport } from '@nuxt/test-utils/runtime'
import { gameFull, playerOne, playerTwo } from '~~/test/fixtures'

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

const gameWithPlayerTwoAt40: GameFull = {
  ...gameFull,
  sets: [
    {
      id: 'winning-test-set',
      gameId: gameFull.id,
      number: 1,
      createdAt: new Date(),
      endedAt: null,
      winnerId: null,
      legs: [
        {
          id: 'winning-test-leg',
          setId: 'winning-test-set',
          number: 1,
          createdAt: new Date(),
          endedAt: null,
          winnerId: null,
          turns: [
            {
              id: 'prev-turn',
              legId: 'winning-test-leg',
              playerId: playerTwo.id,
              startedAt: new Date(),
              startingScore: 501,
              totalScored: 461,
              remainingScore: 40,
              isBust: false,
              _count: { throws: 0 },
            },
          ],
        },
      ],
    },
  ],
}

describe('useGame - turn management', () => {
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

  describe('submitTurn', () => {
    it('should make a single POST to the turns endpoint', async () => {
      const { submitTurn } = useGame()

      await submitTurn({
        throws: [
          { segment: 'S1', scored: 1 },
          { segment: 'S1', scored: 1 },
          { segment: 'S1', scored: 1 },
        ],
        isBust: false,
      })

      expect(fetchMock).toHaveBeenCalledOnce()
      expect(fetchMock).toHaveBeenCalledWith(
        `/api/games/${gameFull.id}/turns`,
        expect.objectContaining({ method: 'POST' }),
      )
    })

    it('should include the throw data in the body', async () => {
      const { submitTurn } = useGame()

      const throws = [
        { segment: 'T20', scored: 60 },
        { segment: 'T20', scored: 60 },
        { segment: 'S13', scored: 13 },
      ]

      await submitTurn({ throws, isBust: false })

      expect(fetchMock).toHaveBeenCalledWith(
        `/api/games/${gameFull.id}/turns`,
        expect.objectContaining({
          body: expect.objectContaining({
            throws,
            isBust: false,
            playerId: playerTwo.id,
          }),
        }),
      )
    })

    it('should include isBust: true for a bust throw', async () => {
      const { submitTurn } = useGame()

      await submitTurn({
        throws: [{ segment: 'T20', scored: 60 }],
        isBust: true,
      })

      expect(fetchMock).toHaveBeenCalledWith(
        `/api/games/${gameFull.id}/turns`,
        expect.objectContaining({
          body: expect.objectContaining({ isBust: true }),
        }),
      )
    })

    it('should include gameUpdate with next active player for a non-winning throw', async () => {
      const { submitTurn } = useGame()

      await submitTurn({
        throws: [{ segment: 'S1', scored: 1 }],
        isBust: false,
      })

      expect(fetchMock).toHaveBeenCalledWith(
        `/api/games/${gameFull.id}/turns`,
        expect.objectContaining({
          body: expect.objectContaining({
            gameUpdate: expect.objectContaining({
              activePlayerId: playerOne.id,
            }),
          }),
        }),
      )
    })

    it('should include legUpdate and newLeg when winning a leg (not enough legs for set)', async () => {
      cachedGameValue.value = { ...gameWithPlayerTwoAt40 }
      useLazyAsyncDataMock.mockReturnValue({
        data: ref(gameWithPlayerTwoAt40),
        pending: ref(false),
        error: ref(null),
        refresh: vi.fn(),
      })

      const { submitTurn } = useGame()

      await submitTurn({
        throws: [{ segment: 'D20', scored: 40 }],
        isBust: false,
      })

      expect(fetchMock).toHaveBeenCalledWith(
        `/api/games/${gameFull.id}/turns`,
        expect.objectContaining({
          body: expect.objectContaining({
            legUpdate: expect.objectContaining({
              legId: 'winning-test-leg',
              winnerId: playerTwo.id,
            }),
            newLeg: expect.objectContaining({
              setId: 'winning-test-set',
              number: 2,
            }),
            gameUpdate: expect.objectContaining({
              activePlayerId: playerOne.id,
            }),
          }),
        }),
      )
    })

    it('should not call the API when game is not loaded', async () => {
      cachedGameValue.value = null
      useLazyAsyncDataMock.mockReturnValue({
        data: ref(null),
        pending: ref(false),
        error: ref(null),
        refresh: vi.fn(),
      })

      const { submitTurn } = useGame()

      await submitTurn({ throws: [], isBust: false })

      expect(fetchMock).not.toHaveBeenCalled()
    })
  })

  describe('undoLastTurn', () => {
    it('should delete the last turn in a single API call', async () => {
      const lastTurn = gameFull.sets.at(-1)?.legs.at(-1)?.turns.at(-1) ?? {
        id: 'unknown',
        playerId: playerTwo.id,
      }
      const { undoLastTurn } = useGame()

      await undoLastTurn()

      expect(fetchMock).toHaveBeenCalledOnce()
      expect(fetchMock).toHaveBeenCalledWith(
        `/api/games/${gameFull.id}/turns/${lastTurn.id}`,
        expect.objectContaining({ method: 'DELETE' }),
      )
    })

    it('should send activePlayerId of the undone turn in the request body', async () => {
      const lastTurn = gameFull.sets.at(-1)?.legs.at(-1)?.turns.at(-1) ?? {
        id: 'unknown',
        playerId: playerOne.id,
      }
      const { undoLastTurn } = useGame()

      await undoLastTurn()

      expect(fetchMock).toHaveBeenCalledWith(
        `/api/games/${gameFull.id}/turns/${lastTurn.id}`,
        expect.objectContaining({
          body: { activePlayerId: lastTurn.playerId },
        }),
      )
    })

    it('should not make separate calls to update the game', async () => {
      const { undoLastTurn } = useGame()

      await undoLastTurn()

      expect(fetchMock).toHaveBeenCalledOnce()
      expect(fetchMock).not.toHaveBeenCalledWith(
        `/api/games/${gameFull.id}`,
        expect.anything(),
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
