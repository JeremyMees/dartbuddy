export const useRootStore = defineStore('root', () => {
  const route = useRoute()
  const selectedRange = useRouteQuery<GameRange>('range', 'lastWeek')
  const selectedGameType = ref<GameType>('scoreTraining')
  const formTitle = ref<string>()
  const isDrawerOpen = ref<boolean>(false)

  watch(isDrawerOpen, (open) => {
    if (!open) {
      formTitle.value = undefined
    }
  })

  watch(
    () => route.path,
    (path) => {
      const normalizedPath = path.replace(/\/+$/, '') || '/'
      const gameType =
        normalizedPath === '/'
          ? 'scoreTraining'
          : (kebabToCamel(normalizedPath.slice(1)) as GameType)

      selectedGameType.value = gameType
    },
    { immediate: true },
  )

  watch(selectedGameType, (newGameType) => {
    let path = `/${camelToKebab(newGameType)}`

    if (path === '/score-training') {
      path = '/'
    }

    navigateTo({
      path,
      query: { range: selectedRange.value },
    })
  })

  return {
    selectedGameType,
    selectedRange,
    formTitle,
    isDrawerOpen,
  }
})
