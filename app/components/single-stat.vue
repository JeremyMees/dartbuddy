<script lang="ts" setup>
defineProps<{
  name: string
  value: number | string
}>()
</script>

<template>
  <div class="flex flex-col gap-0.5">
    <span data-test-name class="text-xs text-muted-foreground">{{ name }}</span>
    <span data-test-value class="font-bold">{{ value }}</span>
  </div>
</template>
