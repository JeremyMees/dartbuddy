<script lang="ts" setup>
const props = defineProps<{
  points: number
  outType: OutType
}>()

const bustScore = props.outType === 'STRAIGHT' ? 1 : 2
</script>

<template>
  <div v-if="points >= bustScore || points === 0" class="text-4xl font-black">
    {{ points }}
    <span class="text-xs font-normal">Score</span>
  </div>
  <div v-else class="text-4xl font-black">Bust</div>
</template>
