<script setup lang="ts">
const {
  game,
  players,
  pending,
  error,
  isMatchOver,
  currentSet,
  currentLeg,
  addTurn,
  handleWinningThrow,
  setNextPlayer,
  refresh,
} = useGame()

const {
  thrownSegments,
  maxThrowsHit,
  totalThrowScore,
  addThrownSegment,
  resetThrownSegments,
  removeThrownSegment,
} = useThrownSegments()

const activePlayerStats = computed(() =>
  players.value.find((p) => p.playerId === game.value?.activePlayerId),
)

const canSubmit = computed(() => {
  if (!thrownSegments.value.length || !game.value || !activePlayerStats.value) {
    return false
  }

  if (maxThrowsHit.value) return true

  const remaining = activePlayerStats.value.points - totalThrowScore.value
  const lastSegment = thrownSegments.value.at(-1)
  const bust = isBust(game.value.outType, remaining, lastSegment)

  return remaining === 0 || bust
})

async function submitThrows() {
  if (
    !game.value ||
    !currentSet.value ||
    !currentLeg.value ||
    !activePlayerStats.value
  ) {
    return
  }

  const startingScore = activePlayerStats.value.points

  const throwsData = thrownSegments.value.map((segment) => ({
    segment,
    scored: calculateSegmentScore(segment),
  }))

  const remaining = startingScore - totalThrowScore.value
  const lastSegment = thrownSegments.value.at(-1)
  const bust = isBust(game.value.outType, remaining, lastSegment)

  await addTurn({
    legId: currentLeg.value.id,
    playerId: game.value.activePlayerId,
    startingScore,
    throws: throwsData,
    isBust: bust,
  })

  if (remaining === 0 && !bust) {
    await handleWinningThrow()
  } else {
    await setNextPlayer()
  }

  resetThrownSegments()
  await refresh()
}
</script>

<template>
  <NuxtLayout>
    <template v-if="game" #top>
      <GameControls
        :score-limit="game.startScore"
        :out-type="game.outType"
        :sets-to-win="game.setsToWin"
        :legs-to-win="game.legsToWin"
        @end="console.log('Session ended')"
        @reset="console.log('Session reset')"
        @new="console.log('New session started')"
      />
    </template>

    <div class="flex flex-col gap-2 w-full">
      <template v-if="isMatchOver">
        <IconCard icon="hugeicons:award-01">
          {{ game?.winner?.firstName }}
          <span class="font-bold">"{{ game?.winner?.nickName }}"</span>
          {{ game?.winner?.lastName }}
          has won this match!
        </IconCard>
        <PlayerStatsCard
          v-for="stat in players"
          :key="stat.playerId"
          v-bind="stat"
        />
      </template>
      <template v-else>
        <PlayerCard
          v-for="stat in players"
          :key="stat.playerId"
          v-bind="stat"
          :active="stat.playerId === game?.activePlayerId"
        />
      </template>
    </div>

    <template v-if="!isMatchOver" #bottom>
      <div
        :class="thrownSegments.length && 'mb-2'"
        class="pt-2 grid grid-cols-4 gap-2 items-center border-t"
      >
        <SingleThrowCard
          v-for="thrownSegment in thrownSegments"
          :key="thrownSegment"
          :segment="thrownSegment"
          @remove="removeThrownSegment(thrownSegment)"
        />

        <Button v-if="canSubmit" @click="submitThrows">Submit</Button>
      </div>
      <ThrowKeyboard
        :disabled="maxThrowsHit || pending || !!error"
        @throw="addThrownSegment"
      />
    </template>
  </NuxtLayout>
</template>
