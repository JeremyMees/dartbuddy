<script setup lang="ts">
import { gameRangeOptions, gameTypeOptions } from '#shared/constants/game'

const type = defineModel<GameType>('type')
const range = defineModel<GameRange>('range')
</script>

<template>
  <ButtonGroup class="w-full">
    <Select v-model="type">
      <SelectTrigger class="w-full">
        <Icon name="hugeicons:dart" class="mr-2" />
        {{ gameTypeOptions.find((option) => option.value === type)?.label }}
      </SelectTrigger>
      <SelectContent class="min-w-24">
        <SelectItem
          v-for="item in gameTypeOptions"
          :key="item.value"
          :value="item.value"
        >
          {{ item.label }}
        </SelectItem>
      </SelectContent>
    </Select>

    <Select v-model="range">
      <SelectTrigger class="w-full">
        <Icon name="hugeicons:calendar-01" class="mr-2" />
        {{ gameRangeOptions.find((option) => option.value === range)?.label }}
      </SelectTrigger>
      <SelectContent class="min-w-24">
        <SelectItem
          v-for="item in gameRangeOptions"
          :key="item.value"
          :value="item.value"
        >
          {{ item.label }}
        </SelectItem>
      </SelectContent>
    </Select>
  </ButtonGroup>
</template>
