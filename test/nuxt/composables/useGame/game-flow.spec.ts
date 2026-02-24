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

  describe('handleWinningThrow', () => {
    it('should update leg winner after winning throw', async () => {
      const { handleWinningThrow } = useGame()
      const currentLegId = gameFull.sets.at(-1)?.legs.at(-1)?.id ?? ''

      await handleWinningThrow()

      expect(fetchMock).toHaveBeenCalledWith(
        `/api/games/${gameFull.id}/legs/${currentLegId}`,
        expect.objectContaining({
          method: 'PATCH',
          body: expect.objectContaining({
            winnerId: playerTwo.id,
          }),
        }),
      )
    })

    it('should add a new leg if legs to win not reached', async () => {
      const { handleWinningThrow } = useGame()
      const currentSetId = gameFull.sets.at(-1)?.id ?? ''

      await handleWinningThrow()

      expect(fetchMock).toHaveBeenCalledWith(
        `/api/games/${gameFull.id}/legs`,
        expect.objectContaining({
          method: 'POST',
          body: expect.objectContaining({
            setId: currentSetId,
          }),
        }),
      )
    })

    it('should not handle winning throw if game is not loaded', async () => {
      useLazyAsyncDataMock.mockReturnValue({
        data: ref(null),
        pending: ref(false),
        error: ref(null),
        refresh: vi.fn(),
      })

      const { handleWinningThrow } = useGame()

      await handleWinningThrow()

      expect(fetchMock).not.toHaveBeenCalled()
    })

    it('should not handle winning throw if current set is not available', async () => {
      const gameWithoutSets = { ...gameFull, sets: [] }

      useLazyAsyncDataMock.mockReturnValue({
        data: ref(gameWithoutSets),
        pending: ref(false),
        error: ref(null),
        refresh: vi.fn(),
      })

      const { handleWinningThrow } = useGame()

      await handleWinningThrow()

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
