<script setup lang="ts">
const selectedRange = useRouteQuery<GameRange>('range', 'lastWeek')

const { data, error, isPending } = useSsrQuery({
  queryKey: computed(() => ['aroundTheClock', selectedRange.value]),
  queryFn: delayedFunction(
    () =>
      $fetch<AroundTheClockDashboardData>('/api/games/around-the-clock', {
        query: { range: selectedRange.value },
      }),
    250,
  ),
  staleTime: 60_000,
})
</script>

<template>
  <NuxtLayout
    :error-message="error?.message"
    :is-empty="!isPending && !data?.totalGames"
  >
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
          :stat="data?.averageHitPercent?.percent ?? 0"
          percentage
        >
          <template #footer>
            <TrendIndicator
              v-bind="
                data?.averageHitPercent?.trend ?? {
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

        <StatCard
          label="Last Game"
          :stat="data?.lastGame?.hitPercent ?? 0"
          percentage
        >
          <template v-if="data?.lastGame" #footer>
            <span class="text-xs text-muted-foreground">
              {{ formatReadDate(data.lastGame.createdAt) }}
            </span>
          </template>
        </StatCard>

        <StatCard label="Total Darts" :stat="data?.dartsThrown ?? 0">
          <template #footer>
            <span class="text-xs text-muted-foreground"> thrown overall </span>
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
            <SkeletonAroundTheClockRow v-for="i in 5" :key="i" />
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
              <span class="text-sm text-muted-foreground">
                {{ game.dartsThrown }} darts
              </span>
            </li>
          </template>
        </ul>
      </CardContent>
    </Card>
  </NuxtLayout>
</template>
