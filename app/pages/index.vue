<script setup lang="ts">
const store = useScoreTrainingStore()
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
          <SkeletonStatCard />
          <SkeletonStatCard />
          <SkeletonStatCard />
          <SkeletonStatCard />
        </template>

        <template v-else>
          <StatCard label="Avg Score" :stat="store.averageScore.percent">
            <template #footer>
              <TrendIndicator v-bind="store.averageScore.trend" />
            </template>
          </StatCard>
          <StatCard
            label="Best Game"
            :stat="store.bestGame ? store.bestGame.totalScore : 0"
          >
            <template v-if="store.bestGame" #footer>
              <span class="text-xs text-muted-foreground">
                {{ formatReadDate(store.bestGame.createdAt) }}
              </span>
            </template>
          </StatCard>
          <StatCard label="Best 3-Dart Avg" :stat="store.bestThreeDarts" />
          <StatCard label="Total 180S" :stat="store.thrownOneEighties" />
          <StatCard label="Highest Throw" :stat="store.highestThrow" />
          <StatCard
            label="Avg Highest throw"
            :stat="store.averageHighestThrow"
          />
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
              <template v-if="store.isPending">
                <SkeletonScoreTrainingRow v-for="i in 5" :key="i" />
              </template>
              <template v-else-if="store.recentGames.length">
                <TableRow
                  v-for="game in store.recentGames"
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
