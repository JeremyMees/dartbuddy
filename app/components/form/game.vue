<script lang="ts" setup>
import { gameTypeOptions } from '#shared/constants/game'

const emit = defineEmits<{ created: [] }>()

const formTitle = defineModel<string>()
const selectGameType = ref<GameType>()

function setGameType(type: { value: GameType; label: string } | undefined) {
  selectGameType.value = type ? type.value : undefined
  formTitle.value = type ? type.label : undefined
}
</script>

<template>
  <div v-if="!selectGameType" class="p-4 flex flex-col gap-2">
    <Button
      v-for="type in gameTypeOptions"
      :key="type.value"
      @click="setGameType(type)"
    >
      {{ type.label }}
    </Button>
  </div>
  <FormAroundTheClock
    v-else-if="selectGameType === 'aroundTheClock'"
    @back="setGameType(undefined)"
    @created="emit('created')"
  />
  <FormSinglesTraining
    v-else-if="selectGameType === 'singlesTraining'"
    @back="setGameType(undefined)"
    @created="emit('created')"
  />
  <FormDoublesTraining
    v-else-if="selectGameType === 'doublesTraining'"
    @back="setGameType(undefined)"
    @created="emit('created')"
  />
  <FormScoreTraining
    v-else-if="selectGameType === 'scoreTraining'"
    @back="setGameType(undefined)"
    @created="emit('created')"
  />
</template>
