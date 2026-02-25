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

describe('useGame - player management', () => {
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

  describe('player rotation via submitTurn', () => {
    it('should advance to the next player after a non-winning throw', async () => {
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

    it('should keep the same player in a single-player game', async () => {
      const singlePlayerGame: GameFull = {
        ...gameFull,
        activePlayerId: playerTwo.id,
        players: [gameFull.players[0]!],
      }

      cachedGameValue.value = { ...singlePlayerGame }
      useLazyAsyncDataMock.mockReturnValue({
        data: ref(singlePlayerGame),
        pending: ref(false),
        error: ref(null),
        refresh: vi.fn(),
      })

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
              activePlayerId: playerTwo.id,
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
})
