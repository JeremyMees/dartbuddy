<script setup lang="ts">
const store = useRootStore()
const { selectedRange } = storeToRefs(store)

const { data, error, isPending } = useQuery({
  key: () => ['scoreTraining', selectedRange.value],
  query: () =>
    $fetch<ScoreTrainingGame[]>('/api/games/score-training', {
      query: { range: selectedRange.value },
    }),
})

const isEmpty = computed(() => !isPending.value && !games.value.length)

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
          <SkeletonStatCard has-badge />
          <SkeletonStatCard has-label />
          <SkeletonStatCard />
          <SkeletonStatCard />
          <SkeletonStatCard />
          <SkeletonStatCard />
        </template>

        <template v-else>
          <StatCard label="Avg Score" :stat="averageScore.percent">
            <template #footer>
              <TrendIndicator v-bind="averageScore.trend" />
            </template>
          </StatCard>
          <StatCard
            label="Best Game"
            :stat="bestGame ? bestGame.totalScore : 0"
          >
            <template v-if="bestGame" #footer>
              <span class="text-xs text-muted-foreground">
                {{ formatReadDate(bestGame.createdAt) }}
              </span>
            </template>
          </StatCard>
          <StatCard label="Best 3-Dart Avg" :stat="bestThreeDarts" />
          <StatCard label="Total 180S" :stat="thrownOneEighties" />
          <StatCard label="Highest Throw" :stat="highestThrow" />
          <StatCard label="Avg Highest throw" :stat="averageHighestThrow" />
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
            :data="scoreTrend"
            x-label="Date"
            y-label="Score"
            dataset-label="Score Trend"
            :sort="sortEntriesByDate"
          />
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
                <TableHead>Total</TableHead>
                <TableHead>Highest</TableHead>
                <TableHead>3-Dart Avg</TableHead>
                <TableHead>180S</TableHead>
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
                  <TableCell>{{ game.totalScore }}</TableCell>
                  <TableCell>{{ game.highestScore }}</TableCell>
                  <TableCell>{{ game.threeDartAverage }}</TableCell>
                  <TableCell>{{ game.oneEightyCount }}</TableCell>
                </TableRow>
              </template>
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </template>
  </NuxtLayout>
</template>
