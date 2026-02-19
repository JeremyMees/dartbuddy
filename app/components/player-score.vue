<script lang="ts" setup>
defineProps<{ points: number }>()
</script>

<template>
  <div class="text-4xl font-black">
    {{ points }}
    <span class="text-xs font-normal"> Score </span>
  </div>
</template>
