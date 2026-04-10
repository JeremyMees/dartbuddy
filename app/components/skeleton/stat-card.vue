<script lang="ts" setup>
defineProps<{
  hasLabel?: boolean
  hasBadge?: boolean
}>()
</script>

<template>
  <div
    class="flex flex-col items-center relative overflow-hidden py-4 gap-1.5 border-b"
  >
    <Skeleton class="w-16 h-5" />
    <div class="pt-0 flex-1">
      <Skeleton class="w-16 h-9" />
    </div>
    <Skeleton v-if="hasLabel" class="w-14 h-3" />
    <Skeleton v-else-if="hasBadge" class="w-14 h-5.5" />
  </div>
</template>
