<script setup lang="ts">
const emit = defineEmits<{
  end: []
  reset: []
  undo: []
}>()

const props = defineProps<{
  scoreLimit: number
  outType: OutType
  setsToWin: number
  legsToWin: number
  currentLeg: GameLeg | null
  isMatchOver: boolean
}>()

const popoverOpen = ref(false)

const canUndo = computed(() => {
  if (!props.currentLeg || props.isMatchOver) return false

  return props.currentLeg.turns.length > 0
})

const outTypeText: Record<OutType, string> = {
  STRAIGHT: 'Single Out',
  DOUBLE: 'Double Out',
  MASTER: 'Master Out',
}

function emitAndClose(event: string) {
  if (event === 'end') emit('end')
  if (event === 'reset') emit('reset')
  if (event === 'undo') emit('undo')

  popoverOpen.value = false
}
</script>

<template>
  <div class="flex gap-4 items-center justify-between">
    <div class="flex flex-col text-sm">
      <span> {{ scoreLimit }} - {{ outTypeText[outType] }} </span>
      <span> First to {{ setsToWin }} sets {{ legsToWin }} legs </span>
    </div>

    <Popover v-model:open="popoverOpen" @update:open="popoverOpen = $event">
      <PopoverTrigger as-child>
        <Button variant="outline">
          Actions
          <Icon name="hugeicons:arrow-down-01" />
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end">
        <div class="flex flex-col gap-2">
          <button
            aria-label="Undo last turn"
            :disabled="!canUndo"
            class="border-b pb-2 flex flex-col gap-1 text-left disabled:cursor-not-allowed disabled:opacity-50"
            @click="emitAndClose('undo')"
          >
            <p class="font-bold">Undo last turn</p>
            <p class="text-xs text-muted-foreground">
              This will remove the last turn and restore the previous player's
              turn.
            </p>
          </button>
          <button
            aria-label="End session"
            :disabled="isMatchOver"
            class="border-b pb-2 flex flex-col gap-1 text-left disabled:cursor-not-allowed disabled:opacity-50"
            @click="emitAndClose('end')"
          >
            <p class="font-bold">End session</p>
            <p class="text-xs text-muted-foreground">
              This will end the current session and the player with the most
              sets won will be declared the winner. Decided by legs if sets are
              tied.
            </p>
          </button>
          <button
            aria-label="Reset session"
            :disabled="isMatchOver"
            class="flex flex-col gap-1 text-left disabled:cursor-not-allowed disabled:opacity-50"
            @click="emitAndClose('reset')"
          >
            <p class="font-bold">Reset session</p>
            <p class="text-xs text-muted-foreground">
              This will reset the current session, clearing all scores and
              progress.
            </p>
          </button>
        </div>
      </PopoverContent>
    </Popover>
  </div>
</template>
