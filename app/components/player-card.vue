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
    class="border rounded-lg w-full py-2 flex flex-col gap-2 transition-colors duration-300"
  >
    <span class="text-lg px-4">
      {{ firstName }}
      <span class="font-bold">"{{ nickName }}"</span>
      {{ lastName }}
    </span>

    <div class="px-4 pt-2 flex gap-4 items-center justify-between">
      <div class="text-4xl font-black">
        {{ points }}
      </div>
      <div class="flex gap-4">
        <div class="flex flex-col items-center gap-0.5">
          <Icon name="hugeicons:medal-02" />
          <span class="text-xs font-bold">{{ sets }}</span>
          <span
            :class="
              active ? 'text-primary-foreground/50' : 'text-muted-foreground'
            "
            class="text-xs transition-colors duration-300"
            >Sets</span
          >
        </div>
        <div class="flex flex-col items-center gap-0.5">
          <Icon name="hugeicons:stack-star" />
          <span class="text-xs font-bold">{{ legs }}</span>
          <span
            :class="
              active ? 'text-primary-foreground/50' : 'text-muted-foreground'
            "
            class="text-xs transition-colors duration-300"
            >Legs</span
          >
        </div>
        <div class="flex flex-col items-center gap-0.5">
          <Icon name="hugeicons:dart" />
          <span class="text-xs font-bold">{{ thrown }}</span>
          <span
            c
            :class="
              active ? 'text-primary-foreground/50' : 'text-muted-foreground'
            "
            class="text-xs transition-colors duration-300"
            >Darts</span
          >
        </div>
        <div class="flex flex-col items-center gap-0.5">
          <Icon name="hugeicons:chart-01" />
          <span class="text-xs font-bold">{{ average }}</span>
          <span
            :class="
              active ? 'text-primary-foreground/50' : 'text-muted-foreground'
            "
            class="text-xs transition-colors duration-300"
            >Average</span
          >
        </div>
      </div>
    </div>

    <Separator
      :class="active ? 'bg-primary-foreground/50' : 'bg-border'"
      class="transition-colors duration-300"
    />

    <div class="px-4 flex gap-2 items-center justify-between">
      <span class="text-sm">Possible throws:</span>
      <div class="flex gap-2 items-center">
        <div
          v-for="bestThrow in nextThrows"
          :key="bestThrow"
          class="p-1 w-14 rounded-lg text-center font-bold bg-accent"
        >
          {{ bestThrow }}
        </div>
      </div>
    </div>
  </div>
</template>
