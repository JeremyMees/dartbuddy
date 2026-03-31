<script setup lang="ts">
const selectedGameType = ref<GameType>('aroundTheClock')
const selectedRange = ref<GameRange>('lastWeek')

const { data, pending, error } = useLazyFetch('/api/games', {
  params: {
    type: selectedGameType,
    range: selectedRange,
  },
  watch: [selectedGameType, selectedRange],
})
</script>

<template>
  <NuxtLayout>
    <ErrorMessage v-if="error" :message="error.message" />

    <div
      v-else-if="pending"
      class="flex flex-1 w-full items-center justify-center p-6 md:p-12"
    >
      <Spinner class="size-10!" />
    </div>

    <Empty v-else-if="!data?.games.length" class="w-full">
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

    <pre v-else-if="data.games.length">
      data: {{ data }}
    </pre>

    <template #bottom>
      <GameFilters
        v-model:type="selectedGameType"
        v-model:range="selectedRange"
      />
    </template>
  </NuxtLayout>
</template>
