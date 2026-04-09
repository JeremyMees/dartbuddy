export const useScoreTrainingStore = defineStore('scoreTraining', () => {
  const rootStore = useRootStore()
  const { selectedRange } = storeToRefs(rootStore)

  const { data, error, isPending } = useQuery({
    key: () => ['scoreTraining', selectedRange.value],
    query: () =>
      $fetch(`/api/games/score-training?range=${selectedRange.value}`),
  })

  const games = computed(() => data.value ?? [])

  const averageScore = computed(() => ({
    percent: getAverage(games.value, 'totalScore'),
    trend: getTrendDirection(games.value, 'totalScore'),
  }))

  const recentGames = computed(() => getRecentGames(games.value))

  const bestGame = computed(() => getBestGame(games.value, 'totalScore'))

  const bestThreeDarts = computed(() =>
    games.value.reduce((best, { threeDartAverage }) => {
      return threeDartAverage > best ? threeDartAverage : best
    }, 0),
  )

  const thrownOneEighties = computed(() =>
    games.value.reduce((count, game) => count + game.oneEightyCount, 0),
  )

  const highestThrow = computed(() => getHighest(games.value, 'highestScore'))

  const averageHighestThrow = computed(() =>
    getAverage(games.value, 'highestScore'),
  )

  const scoreTrend = computed(() =>
    getScoreAverageByDate(games.value, 'totalScore'),
  )

  return {
    games,
    error,
    isPending,
    averageScore,
    recentGames,
    bestGame,
    bestThreeDarts,
    thrownOneEighties,
    highestThrow,
    averageHighestThrow,
    scoreTrend,
  }
})
