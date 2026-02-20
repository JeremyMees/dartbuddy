<script setup lang="ts">
const { page, setPage } = usePageQuery()
const dialogOpen = ref(false)

const { data, pending, error, refresh } = await useLazyAsyncData(
  () => `games-${page.value}`,
  (_nuxtApp, { signal }) =>
    $fetch<{ games: GameOverview[]; pagination: PaginationData }>(
      '/api/games',
      {
        signal,
        params: {
          page: page.value - 1,
          amount: 5,
        },
      },
    ),
  {
    watch: [page],
  },
)

async function deleteGame(id: Game['id']) {
  try {
    await $fetch(`/api/games/${id}`, {
      method: 'DELETE',
    })

    await refresh()
  } catch (error) {
    console.error('Error deleting game:', error)
  }
}
</script>

<template>
  <NuxtLayout>
    <div class="flex w-full justify-between items-center gap-2 flex-wrap">
      <h2>Games</h2>

      <Dialog v-model:open="dialogOpen">
        <DialogTrigger as-child>
          <Button :disabled="pending || error">
            <Icon name="hugeicons:add-01" />
            Create game
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle> Create Game </DialogTitle>
          </DialogHeader>
          <FormGame @refresh="refresh" />
        </DialogContent>
      </Dialog>
    </div>

    <Spinner v-if="pending" class="mx-auto my-8 size-10!" />

    <ErrorMessage
      v-else-if="error"
      :message="error.message"
      :retry-fn="refresh"
    />

    <Empty v-else-if="!data?.games.length" class="w-full">
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <Icon name="hugeicons:dart" />
        </EmptyMedia>
        <EmptyTitle>No games found</EmptyTitle>
        <EmptyDescription>
          {{
            page === 1
              ? ' There are no games yet. Click the button above to create your first game.'
              : 'No games found for the page that is selected.'
          }}
        </EmptyDescription>
      </EmptyHeader>
      <EmptyContent v-if="page > 1">
        <Button variant="outline" size="sm" @click="setPage(1)">
          Go back to first page
        </Button>
      </EmptyContent>
    </Empty>

    <div v-else-if="data.games.length" class="w-full flex flex-col gap-2">
      <GameCard
        v-for="game in data.games"
        :key="game.id"
        :game="game"
        @delete="deleteGame"
      />

      <Pagination
        v-if="data.pagination.totalPages > 1"
        v-slot="{ page: currentPage }"
        :default-page="page"
        :items-per-page="data.pagination.amount"
        :total="data.pagination.total"
        :disabled="pending"
        class="mt-4"
        @update:page="setPage"
      >
        <PaginationContent v-slot="{ items }">
          <PaginationPrevious size="icon-sm" />
          <template v-for="(item, index) in items" :key="index">
            <PaginationItem
              v-if="item.type === 'page'"
              :value="item.value"
              :is-active="item.value === currentPage"
              size="icon-sm"
            >
              {{ item.value }}
            </PaginationItem>
          </template>
          <PaginationNext size="icon-sm" />
        </PaginationContent>
      </Pagination>
    </div>
  </NuxtLayout>
</template>
