<script setup lang="ts">
const {
  game,
  players,
  activePlayerStats,
  isMatchOver,
  currentLeg,
  pending,
  error,
  submitTurn,
  refresh,
  undoLastTurn,
  resetGame,
  endGameEarly,
} = useGame()

const {
  thrownSegments,
  maxThrowsHit,
  totalThrowScore,
  addThrownSegment,
  resetThrownSegments,
  removeThrownSegment,
} = useThrownSegments()

const livePoints = computed(() => {
  if (!activePlayerStats.value || !thrownSegments.value.length) return null

  return activePlayerStats.value.points - totalThrowScore.value
})

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
  if (!game.value || !activePlayerStats.value) return

  const startingScore = activePlayerStats.value.points
  const throwsData = thrownSegments.value.map((segment) => ({
    segment,
    scored: calculateSegmentScore(segment),
  }))
  const remaining = startingScore - totalThrowScore.value
  const lastSegment = thrownSegments.value.at(-1)
  const bust = isBust(game.value.outType, remaining, lastSegment)

  resetThrownSegments()

  await submitTurn({ throws: throwsData, isBust: bust })

  await nextTick()
  const element = document.getElementById(game.value.activePlayerId)
  element?.scrollIntoView({ behavior: 'smooth', block: 'center' })
}

async function handleUndo() {
  resetThrownSegments()
  await undoLastTurn()
}

async function handleReset() {
  resetThrownSegments()
  await resetGame()
}

async function handleEndGame() {
  resetThrownSegments()
  await endGameEarly()
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
        :is-match-over="isMatchOver"
        :current-leg="currentLeg"
        @end="handleEndGame"
        @reset="handleReset"
        @undo="handleUndo"
      />
    </template>

    <div class="flex flex-col gap-2 w-full overflow-auto pb-12">
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
          :out-type="game?.outType ?? 'DOUBLE'"
        />
      </template>
      <template v-else>
        <PlayerCard
          v-for="stat in players"
          :id="stat.playerId"
          :key="stat.playerId"
          v-bind="stat"
          :active="stat.playerId === game?.activePlayerId"
          :live-points="
            stat.playerId === game?.activePlayerId ? livePoints : null
          "
          :out-type="game?.outType ?? 'DOUBLE'"
        />
      </template>
    </div>

    <template v-if="!isMatchOver" #bottom>
      <div
        :class="thrownSegments.length && 'mb-2'"
        class="pt-2 grid grid-cols-4 gap-2 items-center border-t"
      >
        <SingleThrowCard
          v-for="(thrownSegment, index) in thrownSegments"
          :key="`${index}-${thrownSegment}`"
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
