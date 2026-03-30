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
    <div>hello world</div>
  </NuxtLayout>
</template>
