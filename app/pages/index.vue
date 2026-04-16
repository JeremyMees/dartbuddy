<script setup lang="ts">
const selectedRange = useRouteQuery<GameRange>('range', 'lastWeek')

const { data, isPending, error } = useSsrQuery({
  queryKey: computed(() => ['matchGame', selectedRange.value]),
  queryFn: delayedFunction(
    () =>
      $fetch<MatchGame[]>('/api/games/match-game', {
        query: { range: selectedRange.value },
      }),
    1000,
  ),
})

const isEmpty = computed(() => !isPending.value && !games.value.length)

const games = computed(() => data.value ?? [])

const recentGames = computed(() => getRecentGames(games.value))

const winRate = computed(() => {
  if (!games.value?.length) return 0
  const wins = games.value.filter((g) => g.hasWon).length
  return Math.round((wins / games.value.length) * 100)
})

const checkoutStats = computed(() => ({
  hits: games.value.reduce((a, g) => a + g.checkoutHits, 0),
  thrown: games.value.reduce((a, g) => a + g.checkoutThrown, 0),
  percent: getPercentage(games.value, 'checkoutHits', 'checkoutThrown'),
}))

const threeDartsAverage = computed(() =>
  getAverage(games.value, 'threeDartAverage'),
)

const firstNineDartAverage = computed(() =>
  getAverage(games.value, 'firstNineDartAverage'),
)

const highestFinish = computed(() => getHighest(games.value, 'highestFinish'))

const highestScore = computed(() => getHighest(games.value, 'highestScore'))

const scoreTrend = computed(() => [
  {
    label: '3-Dart Average',
    data: Object.fromEntries(
      games.value.map((g, i) => [`M${i + 1}`, g.threeDartAverage]),
    ),
  },
  {
    label: 'First 9-Dart Average',
    data: Object.fromEntries(
      games.value.map((g, i) => [`M${i + 1}`, g.firstNineDartAverage]),
    ),
  },
])

const winLossDistribution = computed(() => {
  const distribution: Record<string, number> = {}

  games.value.forEach(({ opponent, hasWon }) => {
    const key = hasWon ? `Won vs ${opponent}` : `Lost vs ${opponent}`
    distribution[key] ??= 0
    distribution[key] += 1
  })

  return [
    {
      label: 'Win/Loss Distribution',
      data: distribution,
    },
  ]
})
</script>

<template>
  <NuxtLayout>
    <ErrorMessage v-if="error" :message="error.message" />

    <Empty v-else-if="isEmpty" class="w-full">
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <Icon name="hugeicons:dart" />
        </EmptyMedia>
        <EmptyTitle>No games found</EmptyTitle>
        <EmptyDescription>
          It looks like you haven't played any games yet. Start a game to add
          your stats here!
        </EmptyDescription>
      </EmptyHeader>
    </Empty>

    <template v-else>
      <div class="grid grid-cols-2 divide-x">
        <template v-if="isPending">
          <SkeletonStatCard />
          <SkeletonStatCard />
          <SkeletonStatCard />
          <SkeletonStatCard />
          <SkeletonStatCard />
          <SkeletonStatCard />
        </template>

        <template v-else>
          <StatCard label="Win Rate" :stat="winRate" percentage />
          <StatCard
            label="Checkout %"
            :stat="checkoutStats.percent"
            percentage
          />
          <StatCard label="Highest Score" :stat="highestScore" />
          <StatCard label="Highest Finish" :stat="highestFinish" />
          <StatCard label="3-Dart Avg" :stat="threeDartsAverage" />
          <StatCard label="First 9-Dart Avg" :stat="firstNineDartAverage" />
        </template>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Score Trend</CardTitle>
        </CardHeader>
        <CardContent>
          <Skeleton v-if="isPending" class="w-full aspect-2/1" />
          <LineChart
            v-else
            :datasets="scoreTrend"
            x-label="Match"
            y-label="Score"
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Win/Loss</CardTitle>
        </CardHeader>
        <CardContent>
          <Skeleton v-if="isPending" class="w-full aspect-2/1" />
          <PieChart v-else :datasets="winLossDistribution" />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Recent Games</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Won</TableHead>
                <TableHead>Opponent</TableHead>
                <TableHead>3-Dart Avg</TableHead>
                <TableHead>Checkout %</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <template v-if="isPending">
                <SkeletonScoreTrainingRow v-for="i in 5" :key="i" />
              </template>
              <template v-else-if="recentGames.length">
                <TableRow
                  v-for="game in recentGames"
                  :key="game.id"
                  class="text-sm text-muted-foreground"
                >
                  <TableCell>{{ formatReadDate(game.createdAt) }}</TableCell>
                  <TableCell>{{ game.hasWon ? 'Yes' : 'No' }}</TableCell>
                  <TableCell>{{ game.opponent }}</TableCell>
                  <TableCell>{{ game.threeDartAverage }}</TableCell>
                  <TableCell
                    >{{
                      Math.round(
                        (game.checkoutHits / game.checkoutThrown) * 100,
                      )
                    }}%</TableCell
                  >
                </TableRow>
              </template>
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </template>
  </NuxtLayout>
</template>
