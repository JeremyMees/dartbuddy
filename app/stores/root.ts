export const useRootStore = defineStore('root', () => {
  const selectedRange = useRouteQuery<GameRange>('range', 'lastWeek')
  const selectedGameType = ref<GameType>('scoreTraining')
  const formTitle = ref<string>()
  const isDrawerOpen = ref<boolean>(false)

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
