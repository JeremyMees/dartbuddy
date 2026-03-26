<script setup lang="ts">
// const { data, pending, error, refresh } = await useLazyAsyncData(
//   () => `games-${page.value}`,
//   (_nuxtApp, { signal }) =>
//     $fetch<{ games: GameOverview[]; pagination: PaginationData }>(
//       '/api/games',
//       {
//         signal,
//         params: {
//           page: page.value - 1,
//           amount: 5,
//         },
//       },
//     ),
//   {
//     watch: [page],
//   },
// )
</script>

<template>
  <NuxtLayout>
    <div class="flex w-full justify-between items-center gap-2 flex-wrap">
      hello world
    </div>
  </NuxtLayout>
</template>
