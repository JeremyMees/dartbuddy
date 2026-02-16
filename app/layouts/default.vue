<template>
  <div class="flex min-h-dvh h-dvh flex-col">
    <AppHeader class="shrink-0" />

    <main
      class="flex-1 overflow-y-auto py-4 px-4 sm:px-10 flex flex-col gap-4 items-start"
    >
      <slot />
    </main>

    <AppNavigation class="shrink-0" />
  </div>
</template>
