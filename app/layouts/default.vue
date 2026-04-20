<script setup lang="ts">
import { useQueryClient } from '@tanstack/vue-query'

defineProps<{
  errorMessage?: string
  isEmpty?: boolean
}>()

const queryClient = useQueryClient()
const route = useRoute()
const selectedRange = useRouteQuery<GameRange>('range', 'lastWeek')

const selectedGameType = ref<GameType>('matchGame')
const formTitle = ref<string>()
const isDrawerOpen = ref<boolean>(false)

watch(isDrawerOpen, (open) => {
  if (!open) {
    formTitle.value = undefined
  }
})

watch(
  () => route.path,
  (path) => {
    const normalizedPath = path.replace(/\/+$/, '') || '/'
    const gameType =
      normalizedPath === '/'
        ? 'matchGame'
        : (kebabToCamel(normalizedPath.slice(1)) as GameType)

    selectedGameType.value = gameType
  },
  { immediate: true },
)

watch(
  selectedGameType,
  (newGameType) => {
    let path = `/${camelToKebab(newGameType)}`

    if (path === '/match-game') {
      path = '/'
    }

    if (route.path === path) return

    navigateTo({
      path,
      query: { range: selectedRange.value },
    })
  },
  { immediate: true },
)
</script>

<template>
  <div class="flex h-dvh min-h-dvh flex-col overflow-hidden">
    <div class="shrink-0 border-b">
      <AppHeader />
      <div v-if="$slots.top" class="px-4 pb-2 sm:px-10">
        <slot name="top" />
      </div>
    </div>

    <main class="min-h-0 flex-1 overflow-y-auto overscroll-contain">
      <ErrorMessage v-if="errorMessage" :message="errorMessage" />

      <Empty v-else-if="isEmpty" class="w-full h-full">
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
        <slot />
      </template>
    </main>

    <div class="shrink-0">
      <div class="px-4 py-4 sm:px-10 border-t">
        <Drawer v-model:open="isDrawerOpen">
          <ButtonGroup class="w-full">
            <GameFilters
              v-model:type="selectedGameType"
              v-model:range="selectedRange"
            />
            <ButtonGroup>
              <DrawerTrigger as-child>
                <Button size="icon-lg">
                  <Icon name="hugeicons:add-01" />
                </Button>
              </DrawerTrigger>
            </ButtonGroup>
          </ButtonGroup>

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
                    queryClient.invalidateQueries({
                      queryKey: [selectedGameType],
                    })
                    isDrawerOpen = false
                  }
                "
              />
            </div>
          </DrawerContent>
        </Drawer>
      </div>
    </div>
  </div>
</template>
