<script lang="ts" setup>
import type { HTMLAttributes } from 'vue'

const props = defineProps<{
  label: string
  stat?: string | number
  class?: HTMLAttributes['class']
}>()
</script>

<template>
  <div
    data-slot="card"
    :class="
      cn(
        'flex flex-col items-center relative overflow-hidden py-4 gap-1.5 border-b',
        props.class,
      )
    "
  >
    <div data-test-label class="text-sm text-muted-foreground">
      {{ label }}
    </div>
    <div data-test-stat class="pt-0 flex-1">
      <slot>
        <span class="text-3xl font-bold">
          {{ stat }}
        </span>
      </slot>
    </div>
    <div v-if="$slots.footer" data-test-footer>
      <slot name="footer" />
    </div>
  </div>
</template>
