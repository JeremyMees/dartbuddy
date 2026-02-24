<script lang="ts" setup>
defineProps<{
  icon: string
  name: string
  value: number | string
}>()
</script>

<template>
  <div class="flex flex-col items-center gap-0.5">
    <Icon data-test-icon :name="icon" />
    <span data-test-value class="text-xs font-bold pt-0.5">{{ value }}</span>
    <span data-test-name class="text-xs">{{ name }}</span>
  </div>
</template>
