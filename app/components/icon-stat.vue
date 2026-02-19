<script lang="ts" setup>
defineProps<{
  icon: string
  name: string
  value: number | string
}>()
</script>

<template>
  <div class="flex flex-col items-center gap-0.5">
    <Icon :name="icon" />
    <span class="text-xs font-bold pt-0.5">{{ value }}</span>
    <span class="text-xs">{{ name }}</span>
  </div>
</template>
