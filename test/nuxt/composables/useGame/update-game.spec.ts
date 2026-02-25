import { beforeEach, describe, expect, it, vi } from 'vitest'
import { mockNuxtImport } from '@nuxt/test-utils/runtime'
import { gameFull, playerOne, playerTwo } from '~~/test/fixtures'
import { createMockGame } from '~~/test/mocks/game'

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

const mockGame = createMockGame(useLazyAsyncDataMock)

describe('useGame - updateGame', () => {
  beforeEach(() => {
    vi.clearAllMocks()

    cachedGameValue.value = { ...gameFull }
    routeParamsMock.mockReturnValue({ id: gameFull.id })
    mockGame(gameFull)
    fetchMock.mockImplementation(async (_url, options) => {
      if (options?.onRequest) {
        options.onRequest()
      }

      return {}
    })
  })

  it('should update active player', async () => {
    const { updateGame } = useGame()

    await updateGame({ activePlayerId: playerOne.id })

    expect(fetchMock).toHaveBeenCalledWith(
      `/api/games/${gameFull.id}`,
      expect.objectContaining({
        method: 'PATCH',
        body: { activePlayerId: playerOne.id },
      }),
    )
  })

  it('should update game winner', async () => {
    const { updateGame } = useGame()

    await updateGame({ winnerId: playerOne.id })

    expect(fetchMock).toHaveBeenCalledWith(
      `/api/games/${gameFull.id}`,
      expect.objectContaining({
        method: 'PATCH',
        body: { winnerId: playerOne.id },
      }),
    )
  })

  it('should update game completion details', async () => {
    const completedAt = new Date()
    const { updateGame } = useGame()

    await updateGame({
      winnerId: playerTwo.id,
      completedAt,
      endReason: 'COMPLETED',
    })

    expect(fetchMock).toHaveBeenCalledWith(
      `/api/games/${gameFull.id}`,
      expect.objectContaining({
        method: 'PATCH',
        body: {
          winnerId: playerTwo.id,
          completedAt,
          endReason: 'COMPLETED',
        },
      }),
    )
  })

  it('should handle null winnerId', async () => {
    const { updateGame } = useGame()

    await updateGame({ winnerId: null })

    expect(fetchMock).toHaveBeenCalledWith(
      `/api/games/${gameFull.id}`,
      expect.objectContaining({
        method: 'PATCH',
        body: { winnerId: null },
      }),
    )
  })

  it('should not update if cachedGame is not available', async () => {
    cachedGameValue.value = null

    const { updateGame } = useGame()

    await updateGame({ activePlayerId: playerOne.id })

    expect(fetchMock).not.toHaveBeenCalled()
  })

  it('should optimistically update cached game', async () => {
    const { updateGame } = useGame()

    await updateGame({ activePlayerId: playerOne.id })

    expect(cachedGameValue.value).not.toBeNull()
    expect(cachedGameValue.value?.activePlayerId).toBe(playerOne.id)
    expect(cachedGameValue.value?.activePlayer).toEqual(playerOne)
  })
})
