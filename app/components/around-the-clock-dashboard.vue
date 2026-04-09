<script setup lang="ts">
import type { GameData, Serialized, AroundTheClockGame } from '#shared/types'

const props = defineProps<GameData<Serialized<AroundTheClockGame>>>()

const averageHitPercent = computed(() => ({
  percent: getAverage(props.games, 'hitPercent'),
  trend: getTrendDirection(props.games, 'hitPercent'),
}))

const dartsThrown = computed(() =>
  props.games.reduce((total, game) => total + game.dartsThrown, 0),
)

const recentGames = computed(() => getRecentGames(props.games))

const bestGame = computed(() => getBestGame(props.games, 'hitPercent'))

const lastGame = computed(() => {
  if (!props.games.length) return null
  return props.games[props.games.length - 1]
})

const scoreDistribution = computed(() =>
  getScoreDistribution(props.games, 'hitPercent'),
)

const scoreTrend = computed(() =>
  getScoreAverageByDate(props.games, 'hitPercent'),
)
</script>

<template>
  <div class="grid grid-cols-2 divide-x">
    <StatCard label="Avg Hit %" :stat="averageHitPercent.percent" percentage>
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
        <span class="text-xs text-muted-foreground"> thrown overall </span>
      </template>
    </StatCard>
  </div>

  <Card>
    <CardHeader>
      <CardTitle>Score Trend</CardTitle>
    </CardHeader>
    <CardContent>
      <LineChart
        data-test-line-chart
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
      <BarChart
        data-test-bar-chart
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
      <div v-if="!recentGames.length" class="text-sm text-muted-foreground">
        No games played yet. Start a game to see your stats here!
      </div>
      <ul v-else class="divide-y">
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
      </ul>
    </CardContent>
  </Card>
</template>
