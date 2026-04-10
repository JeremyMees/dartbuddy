<script setup lang="ts">
const store = useSinglesTrainingStore()
</script>

<template>
  <NuxtLayout>
    <ErrorMessage v-if="store.error" :message="store.error.message" />

    <Empty v-else-if="store.isEmpty" class="w-full">
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
        <template v-if="store.isPending">
          <SkeletonStatCard has-badge />
          <SkeletonStatCard has-label />
        </template>

        <template v-else>
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
        </template>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Score Trend</CardTitle>
        </CardHeader>
        <CardContent>
          <Skeleton v-if="store.isPending" class="w-full aspect-2/1" />
          <LineChart
            v-else
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
          <Skeleton v-if="store.isPending" class="w-full aspect-2/1" />
          <BarChart
            v-else
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
          <ul class="divide-y">
            <template v-if="store.isPending">
              <SkeletonSinglesTrainingRow v-for="i in 5" :key="i" />
            </template>
            <template v-else-if="store.recentGames.length">
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
            </template>
          </ul>
        </CardContent>
      </Card>
    </template>
  </NuxtLayout>
</template>
