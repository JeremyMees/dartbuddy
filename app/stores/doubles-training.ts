export const useDoublesTrainingStore = defineStore('doublesTraining', () => {
  const rootStore = useRootStore()
  const { selectedRange } = storeToRefs(rootStore)

  const { data, error, isPending } = useQuery({
    key: ['doublesTraining', selectedRange.value],
    query: () =>
      $fetch(`/api/games/doubles-training?range=${selectedRange.value}`),
  })

  const games = computed(() => data.value ?? [])

  const averageScore = computed(() => ({
    percent: getAverage(games.value, 'hitPercent'),
    trend: getTrendDirection(games.value, 'hitPercent'),
  }))

  const recentGames = computed(() => getRecentGames(games.value))

  const bestGame = computed(() => getBestGame(games.value, 'hitPercent'))

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
    averageScore,
    recentGames,
    bestGame,
    scoreDistribution,
    scoreTrend,
  }
})
