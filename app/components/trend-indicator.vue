<script lang="ts" setup>
import type { TrendResult } from '#shared/types'

const props = defineProps<TrendResult>()

const variant = computed(() => {
  if (props.direction === 'up') return 'secondary'
  if (props.direction === 'down') return 'destructive'
  return 'default'
})

const icon = computed(() => {
  if (props.direction === 'up') return 'hugeicons:arrow-up-right-01'
  if (props.direction === 'down') return 'hugeicons:arrow-down-right-01'
  return 'hugeicons:minus-sign'
})
</script>

<template>
  <Badge :variant="variant">
    <Icon :name="icon" data-test-icon />
    {{ change }}%
  </Badge>
</template>
