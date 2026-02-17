<script setup lang="ts">
const emit = defineEmits<{
  end: []
  reset: []
  new: []
}>()

defineProps<{
  scoreLimit: number
  outType: OutType
  setsToWin: number
  legsToWin: number
}>()

const popoverOpen = ref(false)

const outTypeText: Record<OutType, string> = {
  STRAIGHT: 'Single Out',
  DOUBLE: 'Double Out',
  MASTER: 'Master Out',
}

function emitAndClose(event: string) {
  if (event === 'end') emit('end')
  if (event === 'reset') emit('reset')
  if (event === 'new') emit('new')

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
            aria-label="End session"
            class="border-b pb-2 flex flex-col gap-1 text-left"
            @click="emitAndClose('end')"
          >
            <p class="font-bold">End session</p>
            <p class="text-xs text-muted-foreground">
              This will end the current session and the player with the most
              sets won will be declared the winner.
            </p>
          </button>
          <button
            aria-label="Reset session"
            class="border-b pb-2 flex flex-col gap-1 text-left"
            @click="emitAndClose('reset')"
          >
            <p class="font-bold">Reset session</p>
            <p class="text-xs text-muted-foreground">
              This will reset the current session, clearing all scores and
              progress.
            </p>
          </button>
          <button
            aria-label="New session"
            class="flex flex-col gap-1 text-left"
            @click="emitAndClose('new')"
          >
            <p class="font-bold">New session</p>
            <p class="text-xs text-muted-foreground">
              This will start a new session, resetting all scores and progress.
            </p>
          </button>
        </div>
      </PopoverContent>
    </Popover>
  </div>
</template>
