import { beforeEach, describe, expect, it, vi } from 'vitest'
import { mockNuxtImport } from '@nuxt/test-utils/runtime'

const { routeQueryMock, routerPushMock, onMountedCallbackMock } = vi.hoisted(
  () => {
    return {
      routeQueryMock: vi.fn(),
      routerPushMock: vi.fn(),
      onMountedCallbackMock: vi.fn(),
    }
  },
)

mockNuxtImport('useRoute', () => {
  return () => ({
    query: routeQueryMock(),
  })
})

mockNuxtImport('useRouter', () => {
  return () => ({
    push: routerPushMock,
    afterEach: vi.fn(),
  })
})

mockNuxtImport('onMounted', () => {
  return (cb: () => void) => {
    onMountedCallbackMock(cb)
    cb()
  }
})

describe('usePageQuery', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should return page number from query', () => {
    routeQueryMock.mockReturnValue({ page: '2' })

    const { page } = usePageQuery()

    expect(page.value).toBe(2)
  })

  it('should default to page 1 if query is missing or invalid', () => {
    routeQueryMock.mockReturnValue({})
    const { page } = usePageQuery()

    expect(page.value).toBe(1)

    routeQueryMock.mockReturnValue({ page: '-1' })
    const { page: page2 } = usePageQuery()

    expect(page2.value).toBe(1)

    routeQueryMock.mockReturnValue({ page: 'abc' })
    const { page: page3 } = usePageQuery()

    expect(page3.value).toBe(1)
  })

  it('should update query when setPage is called', () => {
    routeQueryMock.mockReturnValue({ page: '1', other: 'param' })

    const { setPage } = usePageQuery()
    setPage(3)

    expect(routerPushMock).toHaveBeenCalledWith({
      query: { page: 3, other: 'param' },
    })
  })

  it('should set page to 1 on mount if no page query exists', () => {
    routeQueryMock.mockReturnValue({})

    usePageQuery()

    expect(routerPushMock).toHaveBeenCalledWith({
      query: { page: 1 },
    })
  })

  it('should not set page on mount if page query already exists', () => {
    routeQueryMock.mockReturnValue({ page: '3' })

    const { page } = usePageQuery()

    expect(routerPushMock).not.toHaveBeenCalled()
    expect(page.value).toBe(3)
  })
})
