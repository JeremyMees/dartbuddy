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
      <div v-if="$slots.bottom" class="px-4 py-4 sm:px-10 border-t">
        <slot name="bottom" />
      </div>
    </div>
  </div>
</template>
