<script setup lang="ts">
const props = defineProps<{
  active: boolean
  firstName: string
  lastName: string
  nickName: string
  sets: number
  legs: number
  points: number
  thrown: number
  average: number
}>()

const nextThrows = computed<Segment[]>(() => {
  if (!isCheckoutPossible(props.points)) return ['T20', 'T20', 'T20']

  const result = findCheckoutPath(props.points)

  if (!result) return []

  return (result.turns[0] ?? { darts: [] }).darts.map((d) => d.segment)
})
</script>

<template>
  <div
    :class="
      active
        ? 'bg-primary text-primary-foreground border-transparent'
        : 'bg-transparent text-foreground'
    "
    class="border rounded-lg w-full p-4 flex flex-col gap-4 transition-colors duration-300"
  >
    <span class="text-lg">
      {{ firstName }}
      <span class="font-bold">"{{ nickName }}"</span>
      {{ lastName }}
    </span>

    <div class="flex gap-4 items-center justify-between">
      <div class="text-3xl font-black">
        {{ points }}
      </div>
      <div class="flex gap-4">
        <div class="flex gap-2 items-center">
          <Icon name="hugeicons:award-01" />
          <span class="font-bold">{{ sets }}</span>
        </div>
        <div class="flex gap-2 items-center">
          <Icon name="hugeicons:medal-06" />
          <span class="font-bold">{{ legs }}</span>
        </div>
        <div class="flex gap-2 items-center">
          <Icon name="hugeicons:dart" />
          <span class="font-bold">{{ thrown }}</span>
        </div>
        <div class="flex gap-2 items-center">
          <Icon name="hugeicons:chart-01" />
          <span class="font-bold">{{ average }}</span>
        </div>
      </div>
    </div>

    <div
      :class="active ? 'border-primary-foreground/50' : 'border-border'"
      class="flex gap-2 items-center justify-between border-t pt-2 transition-colors duration-300"
    >
      <span class="text-sm">Possible throws:</span>
      <div class="flex gap-2 items-center">
        <div
          v-for="bestThrow in nextThrows"
          :key="bestThrow"
          class="px-2 py-1 w-14 rounded-lg text-center font-bold bg-accent"
        >
          {{ bestThrow }}
        </div>
      </div>
    </div>
  </div>
</template>
