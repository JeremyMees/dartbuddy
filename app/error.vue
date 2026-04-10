<script setup lang="ts">
import type { NuxtError } from '#app'

defineProps<{ error: NuxtError }>()
</script>

<template>
  <div class="px-4 py-4 sm:px-10 flex flex-col gap-6 items-center">
    <h1>{{ error.status }}</h1>
    <p>
      {{ error.message }}
    </p>
    <div
      class="text-xs text-muted-foreground border rounded p-2 bg-muted max-w-full overflow-x-auto whitespace-pre"
    >
      {{ error.stack }}
    </div>
  </div>
</template>
