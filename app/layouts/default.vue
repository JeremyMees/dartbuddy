<template>
  <div class="flex min-h-dvh h-dvh flex-col">
    <AppHeader class="shrink-0" />

    <main class="flex-1 overflow-y-auto px-4 sm:px-10">
      <slot />
    </main>

    <AppNavigation class="shrink-0" />
  </div>
</template>
