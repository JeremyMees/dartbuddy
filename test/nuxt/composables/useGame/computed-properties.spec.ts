import { beforeEach, describe, expect, it, vi } from 'vitest'
import { mockNuxtImport } from '@nuxt/test-utils/runtime'
import { gameFull, playerOne, playerTwo } from '~~/test/fixtures'

const { routeParamsMock, nuxtDataMock, useLazyAsyncDataMock } = vi.hoisted(
  () => {
    return {
      routeParamsMock: vi.fn(),
      nuxtDataMock: vi.fn(),
      useLazyAsyncDataMock: vi.fn(),
    }
  },
)

mockNuxtImport('useRoute', () => {
  return () => ({
    params: routeParamsMock(),
  })
})

mockNuxtImport('useNuxtData', () => {
  return (key: string) => ({
    data: nuxtDataMock(key),
  })
})

mockNuxtImport('useLazyAsyncData', () => {
  return useLazyAsyncDataMock
})

describe('useGame - computed properties', () => {
  beforeEach(() => {
    vi.clearAllMocks()

    routeParamsMock.mockReturnValue({ id: gameFull.id })
    nuxtDataMock.mockReturnValue(ref(gameFull))
    useLazyAsyncDataMock.mockReturnValue({
      data: ref(gameFull),
      pending: ref(false),
      error: ref(null),
      refresh: vi.fn(),
    })
  })

  it('should compute players with their stats', () => {
    const { players } = useGame()

    expect(players.value).toHaveLength(2)
    expect(players.value[0]?.playerId).toBe(playerTwo.id)
    expect(players.value[1]?.playerId).toBe(playerOne.id)
    expect(players.value[0]).toHaveProperty('average')
    expect(players.value[0]).toHaveProperty('points')
  })

  it('should return empty array for players when game is not loaded', () => {
    useLazyAsyncDataMock.mockReturnValue({
      data: ref(null),
      pending: ref(false),
      error: ref(null),
      refresh: vi.fn(),
    })

    const { players } = useGame()

    expect(players.value).toEqual([])
  })

  it('should compute activePlayerStats correctly', () => {
    const { activePlayerStats } = useGame()

    expect(activePlayerStats.value).toBeDefined()
    expect(activePlayerStats.value?.playerId).toBe(playerTwo.id)
  })

  it('should return undefined for activePlayerStats when no active player', () => {
    const gameWithoutActivePlayer = {
      ...gameFull,
      activePlayerId: 'non-existent-player',
    }

    useLazyAsyncDataMock.mockReturnValue({
      data: ref(gameWithoutActivePlayer),
      pending: ref(false),
      error: ref(null),
      refresh: vi.fn(),
    })

    const { activePlayerStats } = useGame()

    expect(activePlayerStats.value).toBeUndefined()
  })

  it('should compute isMatchOver as false when no winner', () => {
    const { isMatchOver } = useGame()

    expect(isMatchOver.value).toBe(false)
  })

  it('should compute isMatchOver as true when game has winner', () => {
    const completedGame = { ...gameFull, winnerId: playerOne.id }

    useLazyAsyncDataMock.mockReturnValue({
      data: ref(completedGame),
      pending: ref(false),
      error: ref(null),
      refresh: vi.fn(),
    })

    const { isMatchOver } = useGame()

    expect(isMatchOver.value).toBe(true)
  })

  it('should compute currentSet as the last set', () => {
    const { currentSet } = useGame()

    expect(currentSet.value).toBeDefined()
    expect(currentSet.value?.id).toBe(gameFull.sets[1]?.id)
  })

  it('should return null for currentSet when no sets exist', () => {
    const gameWithoutSets = { ...gameFull, sets: [] }

    useLazyAsyncDataMock.mockReturnValue({
      data: ref(gameWithoutSets),
      pending: ref(false),
      error: ref(null),
      refresh: vi.fn(),
    })

    const { currentSet } = useGame()

    expect(currentSet.value).toBeNull()
  })

  it('should compute currentLeg as the last leg of current set', () => {
    const { currentLeg } = useGame()

    expect(currentLeg.value).toBeDefined()
    expect(currentLeg.value?.id).toBe(gameFull.sets[1]?.legs.at(-1)?.id ?? null)
  })

  it('should return null for currentLeg when no sets exist', () => {
    const gameWithoutSets = { ...gameFull, sets: [] }

    useLazyAsyncDataMock.mockReturnValue({
      data: ref(gameWithoutSets),
      pending: ref(false),
      error: ref(null),
      refresh: vi.fn(),
    })

    const { currentLeg } = useGame()

    expect(currentLeg.value).toBeNull()
  })
})
