<script lang="ts" setup>
import type { HTMLAttributes } from 'vue'

const props = defineProps<{
  class?: HTMLAttributes['class']
}>()
</script>

<template>
  <NuxtLink
    to="/"
    :class="
      cn('w-full flex items-center px-4 sm:px-10 py-2 gap-2', props.class)
    "
  >
    <NuxtImg
      src="/images/mascot.webp"
      alt=""
      class="size-8"
      preload
      width="32"
      height="32"
    />
    <h1 class="text-xl font-bold">DartBuddy</h1>
  </NuxtLink>
</template>
