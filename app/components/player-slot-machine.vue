<script setup lang="ts">
const emit = defineEmits<{
  select: [playerId: string]
}>()

const props = defineProps<{
  players: GameFull['players'][number][]
}>()

const displayIndex = ref(-1)
const isSpinning = ref(false)
const hasResult = ref(false)

const displayedPlayer = computed(() => props.players[displayIndex.value])

function pickPlayer(playerId: string) {
  if (isSpinning.value) return

  emit('select', playerId)
}

function startRandomSpin() {
  if (isSpinning.value || props.players.length === 0) return

  isSpinning.value = true
  hasResult.value = false

  const targetIndex = Math.floor(Math.random() * props.players.length)

  const delays: number[] = []
  let delay = 50
  let totalTime = 0
  const totalDuration = 2500

  while (totalTime < totalDuration) {
    delays.push(delay)
    totalTime += delay
    delay = Math.min(delay * 1.08, 400)
  }

  let elapsed = 0
  let rollingIndex = displayIndex.value

  delays.forEach((tickDelay, i) => {
    elapsed += tickDelay
    const isLast = i === delays.length - 1

    setTimeout(() => {
      if (isLast) {
        displayIndex.value = targetIndex
        isSpinning.value = false
        hasResult.value = true

        setTimeout(
          () => emit('select', props.players[targetIndex]!.playerId),
          2000,
        )
      } else {
        rollingIndex = (rollingIndex + 1) % props.players.length
        displayIndex.value = rollingIndex
      }
    }, elapsed)
  })
}
</script>

<template>
  <div class="flex flex-col gap-3">
    <div
      data-test-display
      :class="[
        'rounded-lg border-2 p-6 flex flex-col items-center justify-center gap-1 min-h-28 transition-colors duration-300',
        hasResult
          ? 'border-primary bg-primary text-primary-foreground animate-pulse'
          : isSpinning
            ? 'border-muted-foreground/30 bg-muted'
            : 'border-dashed border-muted-foreground/30 bg-muted/40',
      ]"
    >
      <span
        data-test-label
        class="text-xs tracking-widest opacity-60 font-medium"
      >
        {{
          isSpinning
            ? 'Rolling...'
            : hasResult
              ? 'Goes first!'
              : 'Who throws first?'
        }}
      </span>
      <span
        v-if="displayedPlayer"
        data-test-displayed-name
        :class="[
          'text-xl font-bold text-center transition-none',
          isSpinning && 'opacity-80',
        ]"
      >
        {{ displayedPlayer?.player.firstName }}
        "{{ displayedPlayer?.player.nickName }}"
        {{ displayedPlayer?.player.lastName }}
      </span>
    </div>

    <template v-if="!isSpinning && !hasResult">
      <Button
        v-for="p in players"
        :key="p.playerId"
        data-test-player-button
        variant="outline"
        class="w-full"
        @click="pickPlayer(p.playerId)"
      >
        {{ p.player.firstName }}
        <span class="font-bold">"{{ p.player.nickName }}"</span>
        {{ p.player.lastName }}
      </Button>

      <Button data-test-random-button class="w-full" @click="startRandomSpin">
        Random
      </Button>
    </template>
  </div>
</template>
