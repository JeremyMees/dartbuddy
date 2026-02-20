<script setup lang="ts">
import type { PlayerStats } from '~~/shared/types/player'

const props = defineProps<
  PlayerStats & {
    active: boolean
    livePoints: number | null
  }
>()

const nextThrows = computed<Segment[]>(() => {
  const pointsToUse = props.livePoints ?? props.points

  if (!isCheckoutPossible(pointsToUse)) return ['T20', 'T20', 'T20']

  const result = findCheckoutPath(pointsToUse)

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
    class="border rounded-lg w-full py-2 flex flex-col gap-2 transition-colors duration-300"
  >
    <span class="text-lg px-4">
      {{ firstName }}
      <span class="font-bold">"{{ nickName }}"</span>
      {{ lastName }}
    </span>

    <div class="px-4 pt-2 flex gap-4 items-center justify-between">
      <PlayerScore :points="points" />
      <div class="flex gap-4">
        <IconStat icon="hugeicons:medal-02" name="Sets" :value="sets" />
        <IconStat icon="hugeicons:stack-star" name="Legs" :value="legs" />
        <IconStat icon="hugeicons:dart" name="Darts" :value="thrown" />
        <IconStat icon="hugeicons:chart-01" name="Average" :value="average" />
      </div>
    </div>

    <Separator
      :class="active ? 'bg-primary-foreground/50' : 'bg-border'"
      class="transition-colors duration-300"
    />

    <div class="px-4 flex gap-2 items-center justify-between">
      <span class="text-xs">Best throws:</span>
      <div class="flex gap-2 items-center">
        <div
          v-for="(bestThrow, index) in nextThrows"
          :key="`${index}-${bestThrow}`"
          class="p-1 w-14 rounded-lg text-center font-bold bg-accent"
        >
          {{ bestThrow }}
        </div>
      </div>
    </div>
  </div>
</template>
