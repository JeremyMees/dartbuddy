<script setup lang="ts">
const selectedGameType = ref<GameType>('aroundTheClock')
const selectedRange = ref<GameRange>('lastWeek')
const formTitle = ref<string>()
const isDrawerOpen = ref<boolean>(false)

const { data, pending, error, refresh } = useLazyFetch('/api/games', {
  params: {
    type: selectedGameType,
    range: selectedRange,
  },
  watch: [selectedGameType, selectedRange],
})
</script>

<template>
  <NuxtLayout>
    <template #top>
      <GameFilters
        v-model:type="selectedGameType"
        v-model:range="selectedRange"
      />
    </template>

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

    <template v-else-if="data.games.length">
      <AroundTheClockDashboard
        v-if="data.type === 'aroundTheClock'"
        v-bind="data"
      />
    </template>

    <template #bottom>
      <Drawer v-model:open="isDrawerOpen">
        <DrawerTrigger as-child>
          <Button class="w-full">
            <Icon name="hugeicons:dart" />
            Add game data
          </Button>
        </DrawerTrigger>
        <DrawerContent>
          <div class="mx-auto w-full max-w-sm">
            <DrawerHeader>
              <DrawerTitle>{{ formTitle || 'Add Game Data' }}</DrawerTitle>
              <DrawerDescription>
                Add your game data to track your progress and analyze your
                performance over time.
              </DrawerDescription>
            </DrawerHeader>
            <FormGame
              v-model="formTitle"
              @created="
                () => {
                  refresh()
                  isDrawerOpen = false
                }
              "
            />
          </div>
        </DrawerContent>
      </Drawer>
    </template>
  </NuxtLayout>
</template>
