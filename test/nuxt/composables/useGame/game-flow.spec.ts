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

const gameWithLegWin: GameFull = {
  ...gameFull,
  sets: [
    {
      id: 'legwin-set',
      gameId: gameFull.id,
      number: 1,
      createdAt: new Date(),
      endedAt: null,
      winnerId: null,
      legs: [
        {
          id: 'legwin-leg',
          setId: 'legwin-set',
          number: 1,
          createdAt: new Date(),
          endedAt: null,
          winnerId: null,
          turns: [
            {
              id: 'prev-turn',
              legId: 'legwin-leg',
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

const gameWithSetWin: GameFull = {
  ...gameFull,
  setsToWin: 2,
  sets: [
    {
      id: 'setwin-set',
      gameId: gameFull.id,
      number: 1,
      createdAt: new Date(),
      endedAt: null,
      winnerId: null,
      legs: [
        {
          id: 'leg-already-won',
          setId: 'setwin-set',
          number: 1,
          createdAt: new Date(),
          endedAt: new Date(),
          winnerId: playerTwo.id,
          turns: [],
        },
        {
          id: 'setwin-leg',
          setId: 'setwin-set',
          number: 2,
          createdAt: new Date(),
          endedAt: null,
          winnerId: null,
          turns: [
            {
              id: 'prev-turn-2',
              legId: 'setwin-leg',
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

describe('useGame - game flow', () => {
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

  describe('submitTurn - winning scenarios', () => {
    it('should include legUpdate and newLeg when player wins a leg but not the set', async () => {
      cachedGameValue.value = { ...gameWithLegWin }
      useLazyAsyncDataMock.mockReturnValue({
        data: ref(gameWithLegWin),
        pending: ref(false),
        error: ref(null),
        refresh: vi.fn(),
      })

      const { submitTurn } = useGame()

      await submitTurn({
        throws: [{ segment: 'D20', scored: 40 }],
        isBust: false,
      })

      expect(fetchMock).toHaveBeenCalledOnce()
      expect(fetchMock).toHaveBeenCalledWith(
        `/api/games/${gameFull.id}/turns`,
        expect.objectContaining({
          body: expect.objectContaining({
            legUpdate: expect.objectContaining({
              legId: 'legwin-leg',
              winnerId: playerTwo.id,
            }),
            newLeg: expect.objectContaining({
              setId: 'legwin-set',
              number: 2,
            }),
            gameUpdate: expect.objectContaining({
              activePlayerId: playerOne.id,
            }),
          }),
        }),
      )
    })

    it('should include legUpdate, setUpdate and newSet when player wins the set but not the match', async () => {
      cachedGameValue.value = { ...gameWithSetWin }
      useLazyAsyncDataMock.mockReturnValue({
        data: ref(gameWithSetWin),
        pending: ref(false),
        error: ref(null),
        refresh: vi.fn(),
      })

      const { submitTurn } = useGame()

      await submitTurn({
        throws: [{ segment: 'D20', scored: 40 }],
        isBust: false,
      })

      expect(fetchMock).toHaveBeenCalledOnce()
      expect(fetchMock).toHaveBeenCalledWith(
        `/api/games/${gameFull.id}/turns`,
        expect.objectContaining({
          body: expect.objectContaining({
            legUpdate: expect.objectContaining({ winnerId: playerTwo.id }),
            setUpdate: expect.objectContaining({
              setId: 'setwin-set',
              winnerId: playerTwo.id,
            }),
            newSet: expect.objectContaining({ number: 2 }),
            gameUpdate: expect.objectContaining({
              activePlayerId: playerOne.id,
            }),
          }),
        }),
      )
    })

    it('should include gameUpdate with winnerId when player wins the match', async () => {
      // setsToWin=1 and the player wins their first set → match over
      const gameForMatchWin: GameFull = {
        ...gameWithSetWin,
        setsToWin: 1,
      }
      cachedGameValue.value = { ...gameForMatchWin }
      useLazyAsyncDataMock.mockReturnValue({
        data: ref(gameForMatchWin),
        pending: ref(false),
        error: ref(null),
        refresh: vi.fn(),
      })

      const { submitTurn } = useGame()

      await submitTurn({
        throws: [{ segment: 'D20', scored: 40 }],
        isBust: false,
      })

      expect(fetchMock).toHaveBeenCalledOnce()
      expect(fetchMock).toHaveBeenCalledWith(
        `/api/games/${gameFull.id}/turns`,
        expect.objectContaining({
          body: expect.objectContaining({
            gameUpdate: expect.objectContaining({
              winnerId: playerTwo.id,
              endReason: 'COMPLETED',
            }),
          }),
        }),
      )
    })

    it('should not call the API when game is not loaded', async () => {
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

  describe('resetGame', () => {
    it('should call reset endpoint', async () => {
      const { resetGame } = useGame()

      await resetGame()

      expect(fetchMock).toHaveBeenCalledWith(
        `/api/games/${gameFull.id}/reset`,
        expect.objectContaining({
          method: 'POST',
        }),
      )
    })

    it('should not reset if game is not loaded', async () => {
      useLazyAsyncDataMock.mockReturnValue({
        data: ref(null),
        pending: ref(false),
        error: ref(null),
        refresh: vi.fn(),
      })

      const { resetGame } = useGame()

      await resetGame()

      expect(fetchMock).not.toHaveBeenCalled()
    })
  })

  describe('endGameEarly', () => {
    it('should end game with winner based on sets and legs won', async () => {
      const { endGameEarly } = useGame()

      await endGameEarly()

      expect(fetchMock).toHaveBeenCalledWith(
        `/api/games/${gameFull.id}`,
        expect.objectContaining({
          method: 'PATCH',
          body: expect.objectContaining({
            endReason: 'MANUAL',
            completedAt: expect.any(Date),
          }),
        }),
      )
    })

    it('should determine winner correctly based on sets won', async () => {
      const gameWithOneSetWon = {
        ...gameFull,
        sets: [
          {
            ...gameFull.sets[0],
            winnerId: playerOne.id,
            legs: gameFull.sets[0]?.legs ?? [],
          },
          {
            ...gameFull.sets[1],
            winnerId: null,
            legs: gameFull.sets[1]?.legs ?? [],
          },
        ],
      }

      useLazyAsyncDataMock.mockReturnValue({
        data: ref(gameWithOneSetWon),
        pending: ref(false),
        error: ref(null),
        refresh: vi.fn(),
      })

      const { endGameEarly } = useGame()

      await endGameEarly()

      expect(fetchMock).toHaveBeenCalledWith(
        `/api/games/${gameFull.id}`,
        expect.objectContaining({
          method: 'PATCH',
          body: expect.objectContaining({
            winnerId: playerOne.id,
            endReason: 'MANUAL',
          }),
        }),
      )
    })

    it('should not end game early if game is not loaded', async () => {
      useLazyAsyncDataMock.mockReturnValue({
        data: ref(null),
        pending: ref(false),
        error: ref(null),
        refresh: vi.fn(),
      })

      const { endGameEarly } = useGame()

      await endGameEarly()

      expect(fetchMock).not.toHaveBeenCalled()
    })
  })
})
