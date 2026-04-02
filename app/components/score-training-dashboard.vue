<script setup lang="ts">
import type { GameData, Serialized, ScoreTrainingGame } from '#shared/types'

const props = defineProps<GameData<Serialized<ScoreTrainingGame>>>()

const averageScore = computed(() => ({
  percent: getAverage(props.games, 'totalScore'),
  trend: getTrendDirection(props.games, 'totalScore'),
}))

const recentGames = computed(() => getRecentGames(props.games))

const bestGame = computed(() => getBestGame(props.games, 'totalScore'))

const bestThreeDarts = computed(() =>
  props.games.reduce((best, { threeDartAverage }) => {
    return threeDartAverage > best ? threeDartAverage : best
  }, 0),
)

const thrownOneEighties = computed(() =>
  props.games.reduce((count, game) => count + game.oneEightyCount, 0),
)

const averageHighestThrow = computed(() =>
  getAverage(props.games, 'highestScore'),
)

const scoreDistribution = computed(() =>
  getScoreAverageByDate(props.games, 'totalScore'),
)
</script>

<template>
  <div class="w-full flex flex-col gap-2">
    <div class="grid grid-cols-2 gap-2">
      <StatCard
        data-test-avg-score
        label="Avg Score"
        :stat="averageScore.percent"
      >
        <template #footer>
          <TrendIndicator v-bind="averageScore.trend" />
        </template>
      </StatCard>

      <StatCard
        data-test-total-score
        label="Best Game"
        :stat="bestGame ? bestGame.totalScore : 'N/A'"
      >
        <template v-if="bestGame" #footer>
          <span class="text-xs text-muted-foreground">
            {{ formatReadDate(bestGame.createdAt) }}
          </span>
        </template>
      </StatCard>

      <StatCard
        data-test-best-three-dart-avg
        label="Best 3-Dart Avg"
        :stat="bestThreeDarts"
      />

      <StatCard
        data-test-total-180s
        label="Total 180S"
        :stat="thrownOneEighties"
      />

      <StatCard
        data-test-avg-highest-throw
        label="Avg Highest throw"
        :stat="averageHighestThrow"
        class="col-span-2"
      />
    </div>

    <Card>
      <CardHeader>
        <CardTitle>Score Trend</CardTitle>
      </CardHeader>
      <CardContent>
        <LineChart
          data-test-line-chart
          :data="scoreDistribution"
          x-label="Date"
          y-label="Score"
          dataset-label="Score Trend"
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
        <Table v-else>
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
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  </div>
</template>
