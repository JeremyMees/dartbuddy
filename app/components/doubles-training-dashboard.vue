<script setup lang="ts">
import type { GameData, Serialized, DoublesTrainingGame } from '#shared/types'

const props = defineProps<GameData<Serialized<DoublesTrainingGame>>>()

const averageScore = computed(() => ({
  percent: getAverage(props.games, 'hitPercent'),
  trend: getTrendDirection(props.games, 'hitPercent'),
}))

const recentGames = computed(() => props.games.slice(-5).reverse())

const bestGame = computed(() => getBestGame(props.games, 'hitPercent'))

const scoreDistribution = computed(() =>
  props.games.reduce<Record<string, number>>((distribution, game) => {
    distribution[game.hitPercent] = (distribution[game.hitPercent] ?? 0) + 1
    return distribution
  }, {}),
)
</script>

<template>
  <div class="w-full flex flex-col gap-2">
    <div class="grid grid-cols-2 gap-2">
      <StatCard label="Avg Hit %" :stat="averageScore.percent + '%'">
        <template #footer>
          <TrendIndicator v-bind="averageScore.trend" />
        </template>
      </StatCard>

      <StatCard
        label="Best Game"
        :stat="bestGame ? bestGame.hitPercent + '%' : 'N/A'"
      >
        <template v-if="bestGame" #footer>
          <span class="text-xs text-muted-foreground">
            {{ formatReadDate(bestGame.createdAt) }}
          </span>
        </template>
      </StatCard>
    </div>

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
          </li>
        </ul>
      </CardContent>
    </Card>
  </div>
</template>
