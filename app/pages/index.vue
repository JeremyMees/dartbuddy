<script setup lang="ts">
const selectedRange = useRouteQuery<GameRange>('range', 'lastMonth')

const { data, isPending, error } = useSsrQuery({
  queryKey: computed(() => ['matchGame', selectedRange.value]),
  queryFn: delayedFunction(
    () =>
      $fetch<MatchGameDashboardData>('/api/games/match-game', {
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
        <SkeletonStatCard />
        <SkeletonStatCard />
        <SkeletonStatCard />
        <SkeletonStatCard />
        <SkeletonStatCard />
        <SkeletonStatCard />
      </template>

      <template v-else>
        <StatCard label="Win Rate" :stat="data?.winRate ?? 0" percentage />
        <StatCard
          label="Checkout %"
          :stat="data?.checkoutStats?.percent ?? 0"
          percentage
        />
        <StatCard label="Highest Score" :stat="data?.highestScore ?? 0" />
        <StatCard label="Highest Finish" :stat="data?.highestFinish ?? 0" />
        <StatCard label="3-Dart Avg" :stat="data?.threeDartsAverage ?? 0" />
        <StatCard
          label="First 9-Dart Avg"
          :stat="data?.firstNineDartAverage ?? 0"
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
          x-label="Match"
          y-label="Score"
        />
      </CardContent>
    </Card>

    <Card>
      <CardHeader>
        <CardTitle>Win/Loss</CardTitle>
      </CardHeader>
      <CardContent>
        <Skeleton v-if="isPending" class="w-full aspect-2/1" />
        <PieChart
          v-else
          :datasets="data?.winLossDistribution ?? []"
          :center-text="(data?.winRate ?? 0) + '%'"
          center-subtext="Win Rate"
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
              <TableHead>Won</TableHead>
              <TableHead>Opponent</TableHead>
              <TableHead>3-Dart Avg</TableHead>
              <TableHead>Checkout %</TableHead>
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
                <TableCell>{{ game.hasWon ? 'Yes' : 'No' }}</TableCell>
                <TableCell>{{ game.opponent }}</TableCell>
                <TableCell>{{ game.threeDartAverage }}</TableCell>
                <TableCell>{{ game.checkoutPercentage }}%</TableCell>
              </TableRow>
            </template>
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  </NuxtLayout>
</template>
