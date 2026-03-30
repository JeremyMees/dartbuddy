<script setup lang="ts">
import { gameTypes, gameRanges } from '#shared/constants/game'

const selectedGameType = ref<GameType>('aroundTheClock')
const selectedRange = ref<GameRange>('allTime')

const { data, pending, error } = useLazyFetch('/api/games', {
  params: {
    type: selectedGameType,
    range: selectedRange,
  },
  watch: [selectedGameType, selectedRange],
})
</script>

<template>
  <NuxtLayout>
    <div>hello world</div>
    <pre>
      error: {{ error }}
    </pre>
    <pre>
      pending: {{ pending }}
    </pre>
    <pre>
      gameTypes: {{ gameTypes }}
    </pre>
    <pre>
      gameRanges: {{ gameRanges }}
    </pre>
    <pre>
      data: {{ data }}
    </pre>
  </NuxtLayout>
</template>
