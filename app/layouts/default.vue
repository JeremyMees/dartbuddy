<template>
  <div class="flex min-h-dvh h-dvh flex-col">
    <div class="shrink-0 border-b">
      <AppHeader />
      <div v-if="$slots.top" class="px-4 pb-2 sm:px-10">
        <slot name="top" />
      </div>
    </div>

    <main class="flex-1 overflow-y-auto flex flex-col">
      <slot />
    </main>

    <div class="shrink-0">
      <div v-if="$slots.bottom" class="px-4 py-4 sm:px-10 border-t">
        <slot name="bottom" />
      </div>
    </div>
  </div>
</template>
