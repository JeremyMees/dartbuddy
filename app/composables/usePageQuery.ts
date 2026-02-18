export function usePageQuery() {
  const route = useRoute()
  const router = useRouter()

  const page = computed(() => {
    const p = Number(route.query.page)
    return p && p > 0 ? p : 1
  })

  function setPage(newPage: number) {
    router.push({
      query: {
        ...route.query,
        page: newPage,
      },
    })
  }

  onMounted(() => {
    if (!route.query.page) setPage(1)
  })

  return { page, setPage }
}
