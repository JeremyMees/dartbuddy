<script setup lang="ts">
const selectedRange = useRouteQuery<GameRange>('range', 'lastWeek')

const { data, error, isPending } = useSsrQuery({
  queryKey: computed(() => ['aroundTheClock', selectedRange.value]),
  queryFn: delayedFunction(
    () =>
      $fetch<AroundTheClockGame[]>('/api/games/around-the-clock', {
        query: { range: selectedRange.value },
      }),
    1000,
  ),
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
          <SkeletonStatCard has-label />
          <SkeletonStatCard has-label />
        </template>

        <template v-else>
          <StatCard
            label="Avg Hit %"
            :stat="averageHitPercent.percent"
            percentage
          >
            <template #footer>
              <TrendIndicator v-bind="averageHitPercent.trend" />
            </template>
          </StatCard>

          <StatCard
            label="Best Game"
            :stat="bestGame ? bestGame.hitPercent : 0"
            percentage
          >
            <template v-if="bestGame" #footer>
              <span class="text-xs text-muted-foreground">
                {{ formatReadDate(bestGame.createdAt) }}
              </span>
            </template>
          </StatCard>

          <StatCard
            label="Last Game"
            :stat="lastGame ? lastGame.hitPercent : 0"
            percentage
          >
            <template v-if="lastGame" #footer>
              <span class="text-xs text-muted-foreground">
                {{ formatReadDate(lastGame.createdAt) }}
              </span>
            </template>
          </StatCard>

          <StatCard label="Total Darts" :stat="dartsThrown">
            <template #footer>
              <span class="text-xs text-muted-foreground">
                thrown overall
              </span>
            </template>
          </StatCard>
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
          <CardTitle>Score Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          <Skeleton v-if="isPending" class="w-full aspect-2/1" />
          <BarChart
            v-else
            :data="scoreDistribution"
            x-label="Score"
            y-label="Times Thrown"
            dataset-label="Score Distribution"
            :sort="sortEntriesByNumericValue"
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Recent Games</CardTitle>
        </CardHeader>
        <CardContent>
          <ul class="divide-y">
            <template v-if="isPending">
              <SkeletonAroundTheClockRow v-for="i in 5" :key="i" />
            </template>
            <template v-else-if="recentGames.length">
              <li
                v-for="game in recentGames"
                :key="game.id"
                class="flex items-center gap-6 py-2"
              >
                <span class="text-sm text-muted-foreground">
                  {{ formatReadDate(game.createdAt) }}
                </span>
                <div class="grow flex items-center gap-2">
                  <Progress v-model="game.hitPercent" />
                  <span class="text-sm text-muted-foreground">
                    {{ game.hitPercent }}%
                  </span>
                </div>
                <span class="text-sm text-muted-foreground">
                  {{ game.dartsThrown }} darts
                </span>
              </li>
            </template>
          </ul>
        </CardContent>
      </Card>
    </template>
  </NuxtLayout>
</template>
