<script setup lang="ts">
const selectedRange = useRouteQuery<GameRange>('range', 'lastWeek')

const { data, error, isPending } = useSsrQuery({
  queryKey: computed(() => ['doublesTraining', selectedRange.value]),
  queryFn: delayedFunction(
    () =>
      $fetch<DoublesTrainingDashboardData>('/api/games/doubles-training', {
        query: { range: selectedRange.value },
      }),
    250,
  ),
  staleTime: 60_000,
})
</script>

<template>
  <NuxtLayout>
    <ErrorMessage v-if="error" :message="error.message" />

    <Empty v-else-if="!isPending && !data?.totalGames" class="w-full">
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
          <StatCard
            label="Avg Hit %"
            :stat="data?.averageScore?.percent ?? 0"
            percentage
          >
            <template #footer>
              <TrendIndicator
                v-bind="
                  data?.averageScore?.trend ?? {
                    direction: 'normal',
                    change: 0,
                  }
                "
              />
            </template>
          </StatCard>

          <StatCard
            label="Best Game"
            :stat="data?.bestGame?.hitPercent ?? 0"
            percentage
          >
            <template v-if="data?.bestGame" #footer>
              <span class="text-xs text-muted-foreground">
                {{ formatReadDate(data.bestGame.createdAt) }}
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
            :datasets="data?.scoreTrend ?? []"
            x-label="Date"
            y-label="Score"
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
            :datasets="data?.scoreDistribution ?? []"
            x-label="Score"
            y-label="Times Thrown"
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
              <SkeletonDoublesTrainingRow v-for="i in 5" :key="i" />
            </template>
            <template v-else-if="data?.recentGames?.length">
              <li
                v-for="game in data.recentGames"
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
            </template>
          </ul>
        </CardContent>
      </Card>
    </template>
  </NuxtLayout>
</template>
