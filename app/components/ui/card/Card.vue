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
        'relative overflow-hidden bg-card flex flex-col gap-2 border-b py-6 shadow-sm',
        props.class,
      )
    "
  >
    <slot />
  </div>
</template>
