export const useSinglesTrainingStore = defineStore('singlesTraining', () => {
  const rootStore = useRootStore()
  const { selectedRange } = storeToRefs(rootStore)

  const { data, error, isPending } = useQuery({
    key: ['singlesTraining', selectedRange.value],
    query: () =>
      $fetch(`/api/games/singles-training?range=${selectedRange.value}`),
  })

  const maxScore = 21 * 9

  const games = computed(() => data.value ?? [])

  const averageScore = computed(() => ({
    percent: getAverage(games.value, 'score'),
    trend: getTrendDirection(games.value, 'score'),
  }))

  const recentGames = computed(() => getRecentGames(games.value))

  const bestGame = computed(() => getBestGame(games.value, 'score'))

  const scoreDistribution = computed(() =>
    getScoreDistribution(games.value, 'score'),
  )

  const scoreTrend = computed(() => getScoreAverageByDate(games.value, 'score'))

  return {
    games,
    error,
    isPending,
    averageScore,
    recentGames,
    bestGame,
    scoreDistribution,
    scoreTrend,
    maxScore,
  }
})
