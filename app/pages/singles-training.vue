<script setup lang="ts">
const store = useSinglesTrainingStore()
</script>

<template>
  <NuxtLayout>
    <ErrorMessage v-if="store.error" :message="store.error.message" />

    <div
      v-else-if="store.isPending"
      class="flex flex-1 w-full items-center justify-center p-6 md:p-12"
    >
      <Spinner class="size-10!" />
    </div>

    <Empty v-else-if="!store.games.length" class="w-full">
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

    <template v-else-if="store.games.length">
      <div class="grid grid-cols-2 divide-x">
        <StatCard label="Avg Score" :stat="store.averageScore.percent">
          <template #footer>
            <TrendIndicator v-bind="store.averageScore.trend" />
          </template>
        </StatCard>

        <StatCard
          label="Best Game"
          :stat="store.bestGame ? store.bestGame.score : 0"
        >
          <template v-if="store.bestGame" #footer>
            <span class="text-xs text-muted-foreground">
              {{ formatReadDate(store.bestGame.createdAt) }}
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
            :data="store.scoreTrend"
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
              >Max: {{ store.maxScore }}</span
            >
          </div>
        </CardHeader>
        <CardContent>
          <BarChart
            :data="store.scoreDistribution"
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
          <div
            v-if="!store.recentGames.length"
            class="text-sm text-muted-foreground"
          >
            No games played yet. Start a game to see your stats here!
          </div>
          <ul v-else class="divide-y">
            <li
              v-for="game in store.recentGames"
              :key="game.id"
              class="flex items-center gap-6 py-2"
            >
              <span class="text-sm text-muted-foreground">
                {{ formatReadDate(game.createdAt) }}
              </span>
              <div class="grow flex items-center gap-2">
                <Progress v-model="game.score" :max="store.maxScore" />
                <span class="text-sm text-muted-foreground">
                  {{ game.score }}/{{ store.maxScore }}
                </span>
              </div>
            </li>
          </ul>
        </CardContent>
      </Card>
    </template>
  </NuxtLayout>
</template>
