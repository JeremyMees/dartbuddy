export const useAroundTheClockStore = defineStore('aroundTheClock', () => {
  const rootStore = useRootStore()
  const { selectedRange } = storeToRefs(rootStore)

  const { data, error, isPending } = useQuery({
    key: () => ['aroundTheClock', selectedRange.value],
    query: () =>
      $fetch(`/api/games/around-the-clock?range=${selectedRange.value}`),
  })

  const isEmpty = computed(() => !isPending.value && !games.value.length)

  const games = computed(() => data.value ?? [])

  const averageHitPercent = computed(() => ({
    percent: getAverage(games.value, 'hitPercent'),
    trend: getTrendDirection(games.value, 'hitPercent'),
  }))

  const dartsThrown = computed(() =>
    games.value.reduce((total, game) => total + game.dartsThrown, 0),
  )

  const recentGames = computed(() => getRecentGames(games.value))

  const bestGame = computed(() => getBestGame(games.value, 'hitPercent'))

  const lastGame = computed(() => {
    if (!games.value.length) return null
    return games.value[games.value.length - 1]
  })

  const scoreDistribution = computed(() =>
    getScoreDistribution(games.value, 'hitPercent'),
  )

  const scoreTrend = computed(() =>
    getScoreAverageByDate(games.value, 'hitPercent'),
  )

  return {
    games,
    error,
    isPending,
    isEmpty,
    averageHitPercent,
    dartsThrown,
    recentGames,
    bestGame,
    lastGame,
    scoreDistribution,
    scoreTrend,
  }
})
