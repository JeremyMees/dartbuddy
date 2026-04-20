<script setup lang="ts">
const selectedRange = useRouteQuery<GameRange>('range', 'lastWeek')

const { data, isPending, error } = useSsrQuery({
  queryKey: computed(() => ['scoreTraining', selectedRange.value]),
  queryFn: delayedFunction(
    () =>
      $fetch<ScoreTrainingDashboardData>('/api/games/score-training', {
        query: { range: selectedRange.value },
      }),
    1000,
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
          <SkeletonStatCard />
          <SkeletonStatCard />
          <SkeletonStatCard />
          <SkeletonStatCard />
        </template>

        <template v-else>
          <StatCard label="Avg Score" :stat="data?.averageScore?.percent ?? 0">
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
          <StatCard label="Best Game" :stat="data?.bestGame?.totalScore ?? 0">
            <template v-if="data?.bestGame" #footer>
              <span class="text-xs text-muted-foreground">
                {{ formatReadDate(data.bestGame.createdAt) }}
              </span>
            </template>
          </StatCard>
          <StatCard label="Best 3-Dart Avg" :stat="data?.bestThreeDarts ?? 0" />
          <StatCard label="Total 180S" :stat="data?.thrownOneEighties ?? 0" />
          <StatCard label="Highest Throw" :stat="data?.highestThrow ?? 0" />
          <StatCard
            label="Avg Highest throw"
            :stat="data?.averageHighestThrow ?? 0"
          />
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
          <CardTitle>Recent Games</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
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
              <template v-if="isPending">
                <SkeletonScoreTrainingRow v-for="i in 5" :key="i" />
              </template>
              <template v-else-if="data?.recentGames?.length">
                <TableRow
                  v-for="game in data.recentGames"
                  :key="game.id"
                  class="text-sm text-muted-foreground"
                >
                  <TableCell>{{ formatReadDate(game.createdAt) }}</TableCell>
                  <TableCell>{{ game.totalScore }}</TableCell>
                  <TableCell>{{ game.highestScore }}</TableCell>
                  <TableCell>{{ game.threeDartAverage }}</TableCell>
                  <TableCell>{{ game.oneEightyCount }}</TableCell>
                </TableRow>
              </template>
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </template>
  </NuxtLayout>
</template>
