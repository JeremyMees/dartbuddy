import { vi } from 'vitest'

export function createMockGame(useLazyAsyncDataMock: ReturnType<typeof vi.fn>) {
  return function mockGame(game: GameFull | null) {
    useLazyAsyncDataMock.mockImplementation((key: string) => {
      if (key.startsWith('game-stats-')) {
        return {
          data: ref([]),
          pending: ref(false),
          error: ref(null),
          refresh: vi.fn(),
        }
      }
      return {
        data: ref(game),
        pending: ref(false),
        error: ref(null),
        refresh: vi.fn(),
      }
    })
  }
}
