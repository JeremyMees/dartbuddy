import { beforeEach, describe, expect, it, vi } from 'vitest'
import { mockNuxtImport } from '@nuxt/test-utils/runtime'
import { gameFull, playerOne } from '~~/test/fixtures'

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

  describe('setNextPlayer', () => {
    it('should set the next player as active', async () => {
      const { setNextPlayer } = useGame()

      await setNextPlayer()

      expect(fetchMock).toHaveBeenCalledWith(
        `/api/games/${gameFull.id}`,
        expect.objectContaining({
          method: 'PATCH',
          body: { activePlayerId: playerOne.id },
        }),
      )
    })

    it('should not set next player if game is not loaded', async () => {
      useLazyAsyncDataMock.mockReturnValue({
        data: ref(null),
        pending: ref(false),
        error: ref(null),
        refresh: vi.fn(),
      })

      const { setNextPlayer } = useGame()

      await setNextPlayer()

      expect(fetchMock).not.toHaveBeenCalled()
    })

    it('should not set next player if next player id is undefined', async () => {
      const gameWithInvalidActivePlayer = {
        ...gameFull,
        activePlayerId: 'non-existent-player',
      }

      useLazyAsyncDataMock.mockReturnValue({
        data: ref(gameWithInvalidActivePlayer),
        pending: ref(false),
        error: ref(null),
        refresh: vi.fn(),
      })

      const { setNextPlayer } = useGame()

      await setNextPlayer()

      expect(fetchMock).not.toHaveBeenCalled()
    })
  })
})
