<template>
  <div class="flex min-h-dvh h-dvh flex-col">
    <div class="shrink-0">
      <AppHeader />
      <div v-if="$slots.top" class="p-4 sm:px-10">
        <slot name="top" />
      </div>
    </div>

    <main
      class="flex-1 overflow-y-auto py-4 px-4 sm:px-10 flex flex-col gap-4 items-start"
    >
      <slot />
    </main>

    <div class="shrink-0">
      <div v-if="$slots.bottom" class="px-4 pb-4 sm:px-10">
        <slot name="bottom" />
      </div>
      <AppNavigation />
    </div>
  </div>
</template>
