<script setup lang="ts">
const queryCache = useQueryCache()
const rootStore = useRootStore()

const { selectedRange, selectedGameType, isDrawerOpen, formTitle } =
  storeToRefs(rootStore)
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
      <slot />
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
                    queryCache.invalidateQueries({ key: [selectedGameType] })
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
