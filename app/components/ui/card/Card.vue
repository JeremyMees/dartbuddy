<script setup lang="ts">
import type { HTMLAttributes } from 'vue'

const props = defineProps<{
  class?: HTMLAttributes['class']
}>()
</script>

<template>
  <div
    data-slot="card"
    :class="
      cn(
        'bg-card flex flex-col gap-6 rounded-xl border py-4 shadow-sm',
        props.class,
      )
    "
  >
    <slot />
  </div>
</template>
