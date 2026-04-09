<script setup lang="ts">
import type { GameData, Serialized, SinglesTrainingGame } from '#shared/types'

const props = defineProps<GameData<Serialized<SinglesTrainingGame>>>()

const maxScore = 21 * 9

const averageScore = computed(() => ({
  percent: getAverage(props.games, 'score'),
  trend: getTrendDirection(props.games, 'score'),
}))

const recentGames = computed(() => getRecentGames(props.games))

const bestGame = computed(() => getBestGame(props.games, 'score'))

const scoreDistribution = computed(() =>
  getScoreDistribution(props.games, 'score'),
)

const scoreTrend = computed(() => getScoreAverageByDate(props.games, 'score'))
</script>

<template>
  <div class="grid grid-cols-2 divide-x">
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
      <div class="flex items-center justify-between">
        <CardTitle>Score Distribution</CardTitle>
        <span class="text-muted-foreground text-sm">Max: {{ maxScore }}</span>
      </div>
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
            <Progress v-model="game.score" :max="maxScore" />
            <span class="text-sm text-muted-foreground">
              {{ game.score }}/{{ maxScore }}
            </span>
          </div>
        </li>
      </ul>
    </CardContent>
  </Card>
</template>
