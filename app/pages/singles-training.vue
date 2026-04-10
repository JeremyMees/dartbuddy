<script setup lang="ts">
const store = useRootStore()
const { selectedRange } = storeToRefs(store)

const { data, error, isPending } = useQuery({
  key: () => ['singlesTraining', selectedRange.value],
  query: () =>
    $fetch<SinglesTrainingGame[]>('/api/games/singles-training', {
      query: { range: selectedRange.value },
    }),
})

const maxScore = 21 * 9

const isEmpty = computed(() => !isPending.value && !games.value.length)

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
        </template>

        <template v-else>
          <StatCard label="Avg Score" :stat="averageScore.percent">
            <template #footer>
              <TrendIndicator v-bind="averageScore.trend" />
            </template>
          </StatCard>

          <StatCard label="Best Game" :stat="bestGame ? bestGame.score : 0">
            <template v-if="bestGame" #footer>
              <span class="text-xs text-muted-foreground">
                {{ formatReadDate(bestGame.createdAt) }}
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
          <div class="flex items-center justify-between">
            <CardTitle>Score Distribution</CardTitle>
            <span class="text-muted-foreground text-sm"
              >Max: {{ maxScore }}</span
            >
          </div>
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
              <SkeletonSinglesTrainingRow v-for="i in 5" :key="i" />
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
                  <Progress v-model="game.score" :max="maxScore" />
                  <span class="text-sm text-muted-foreground">
                    {{ game.score }}/{{ maxScore }}
                  </span>
                </div>
              </li>
            </template>
          </ul>
        </CardContent>
      </Card>
    </template>
  </NuxtLayout>
</template>
