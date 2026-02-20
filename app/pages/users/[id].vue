<script setup lang="ts">
const route = useRoute()
const userId = computed(() => route.params.id as string)

const timeRange = ref<string>('30d')

const timeParams = computed(() => {
  const isDays = timeRange.value.endsWith('d')
  const isMonths = timeRange.value.endsWith('m')

  if (isDays) {
    const days = +timeRange.value.slice(0, -1)
    return { days }
  } else if (isMonths) {
    const months = +timeRange.value.slice(0, -1)
    return { months }
  } else {
    return {}
  }
})

const {
  data: stats,
  pending,
  error,
  refresh,
} = await useLazyAsyncData(
  () => `user-stats-${userId.value}-${timeRange.value}`,
  (_nuxtApp, { signal }) =>
    $fetch<FullPlayerStats>(`/api/users/${userId.value}/stats`, {
      signal,
      params: timeParams.value,
    }),
  {
    watch: [timeRange],
  },
)
</script>

<template>
  <NuxtLayout>
    <template #top>
      <div class="flex items-center gap-4 justify-between w-full">
        <NuxtLink to="/users">
          <Button variant="outline" size="icon">
            <Icon name="hugeicons:arrow-left-01" />
          </Button>
        </NuxtLink>

        <Select v-model="timeRange">
          <SelectTrigger class="w-40">
            <SelectValue placeholder="Select time range" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem
              v-for="option in [
                { label: 'All time', value: 'all' },
                { label: 'Last 7 days', value: '7d' },
                { label: 'Last 30 days', value: '30d' },
                { label: 'Last 3 months', value: '3m' },
                { label: 'Last 6 months', value: '6m' },
                { label: 'Last year', value: '12m' },
              ]"
              :key="option.value"
              :value="option.value"
            >
              {{ option.label }}
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div class="pt-2">
        <div v-if="stats?.user">
          {{ stats.user.firstName }}
          <span class="font-bold">"{{ stats.user.nickName }}"</span>
          {{ stats.user.lastName }}
        </div>
        <div v-else>User Statistics</div>
      </div>
    </template>

    <Spinner v-if="pending && !stats" class="mx-auto my-8 size-10!" />

    <ErrorMessage
      v-else-if="error"
      :message="error.message"
      :retry-fn="refresh"
    />

    <template v-else-if="stats">
      <Card class="w-full">
        <CardHeader>
          <CardTitle class="text-base">Score Distribution</CardTitle>
          <CardDescription>Breakdown of turn scores by range</CardDescription>
        </CardHeader>
        <CardContent>
          <BarChart :data="stats.charts.scoreDistribution" />
        </CardContent>
      </Card>

      <div class="grid grid-cols-2 md:grid-cols-4 gap-4 w-full">
        <StatCard label="Games Played" :stat="stats.overview.gamesPlayed" />
        <StatCard label="Win rate" :stat="stats.overview.gamesWon">
          <span class="text-3xl font-bold"
            >{{ stats.overview.winRate.toFixed(1) }}%</span
          >
          <span class="text-xs text-muted-foreground ml-2">
            ({{ stats.overview.gamesWon }}W / {{ stats.overview.gamesLost }}L)
          </span>
        </StatCard>
        <StatCard label="Legs Won" :stat="stats.overview.legsWon" />
        <StatCard label="Sets Won" :stat="stats.overview.setsWon" />
      </div>

      <div class="w-full">
        <h3 class="mb-3">Scoring</h3>
        <div class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          <StatCard
            label="3-Dart Avg"
            :stat="stats.scoring.averageScore.toFixed(1)"
          />
          <StatCard
            label="Per Dart Avg"
            :stat="stats.scoring.averagePerDart.toFixed(1)"
          />
          <StatCard label="180s" :stat="stats.scoring.oneEighties" />
          <StatCard label="100+ Scores" :stat="stats.scoring.tonPlus" />
          <StatCard label="Total Turns" :stat="stats.scoring.totalTurns" />
          <StatCard label="Total Darts" :stat="stats.scoring.totalThrows" />
        </div>
      </div>

      <div class="w-full">
        <h3 class="mb-3">Checkouts</h3>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard
            label="Highest Checkout"
            :stat="stats.checkouts.highest || '-'"
          />
          <StatCard
            label="Avg Checkout"
            :stat="
              stats.checkouts.average > 0
                ? stats.checkouts.average.toFixed(1)
                : '-'
            "
          />
          <StatCard label="Checkout tries" :stat="stats.checkouts.attempts" />
          <StatCard label="Total Checkouts" :stat="stats.checkouts.total" />
        </div>
      </div>
    </template>
  </NuxtLayout>
</template>
