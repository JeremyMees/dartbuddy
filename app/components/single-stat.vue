<script lang="ts" setup>
defineProps<{
  name: string
  value: number | string
}>()
</script>

<template>
  <div class="flex flex-col gap-0.5">
    <span class="text-xs text-muted-foreground">{{ name }}</span>
    <span class="font-bold">{{ value }}</span>
  </div>
</template>
