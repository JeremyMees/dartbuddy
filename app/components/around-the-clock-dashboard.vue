<script setup lang="ts">
import type { GameData, Serialized, AroundTheClockGame } from '#shared/types'

const props = defineProps<GameData<Serialized<AroundTheClockGame>>>()

const averageHitPercent = computed(() => ({
  percent: generateAverage(props.games, 'hitPercent'),
  trend: calculateTrendDirection(props.games, 'hitPercent'),
}))

const dartsThrown = computed(() =>
  props.games.reduce((total, game) => total + game.dartsThrown, 0),
)

const recentGames = computed(() => props.games.slice(-5).reverse())

const bestGame = computed(() => {
  if (!props.games.length) return null
  return props.games.reduce((best, game) =>
    game.hitPercent > best.hitPercent ? game : best,
  )
})

const lastGame = computed(() => {
  if (!props.games.length) return null
  return props.games[props.games.length - 1]
})
</script>

<template>
  <div class="w-full flex flex-col gap-2">
    <div class="grid grid-cols-2 gap-2">
      <StatCard label="Avg Hit %" :stat="averageHitPercent.percent + '%'">
        <template #footer>
          <TrendIndicator v-bind="averageHitPercent.trend" />
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

      <StatCard
        label="Last Game"
        :stat="lastGame ? lastGame.hitPercent + '%' : 'N/A'"
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
  </div>
</template>
