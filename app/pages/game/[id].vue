<script setup lang="ts">
const {
  thrownSegments,
  maxThrowsHit,
  addThrownSegment,
  resetThrownSegments,
  removeThrownSegment,
} = useThrownSegments()

function submitThrows() {
  // Implement the logic for submitting throws here
  resetThrownSegments()
}
</script>

<template>
  <NuxtLayout>
    <template #top>
      <GameControls
        :score-limit="501"
        :out-type="'DOUBLE'"
        :sets-to-win="3"
        :legs-to-win="5"
        @end="console.log('Session ended')"
        @reset="console.log('Session reset')"
        @new="console.log('New session started')"
      />
    </template>

    <div class="flex flex-col gap-2 w-full">
      <PlayerCard
        :active="true"
        first-name="Jeremy"
        last-name="Mees"
        nick-name="per ongeluk 123"
        :sets="3"
        :legs="2"
        :points="13"
        :average="60.5"
        :thrown="6"
      />
      <PlayerCard
        :active="false"
        first-name="Zyon"
        last-name="Devolder"
        nick-name="weeral in de surround"
        :sets="1"
        :legs="5"
        :points="170"
        :average="80.5"
        :thrown="3"
      />
      <PlayerCard
        :active="false"
        first-name="Karel"
        last-name="van Gils"
        nick-name="ernaast"
        :sets="2"
        :legs="1"
        :points="120"
        :average="20"
        :thrown="3"
      />
    </div>

    <template #bottom>
      <div
        :class="thrownSegments.length && 'mb-2'"
        class="pt-2 grid grid-cols-4 gap-2 items-center border-t"
      >
        <SingleThrowCard
          v-for="thrownSegment in thrownSegments"
          :key="thrownSegment"
          :points="calculateSegmentScore(thrownSegment)"
          @remove="removeThrownSegment(thrownSegment)"
        />
        <Button v-if="maxThrowsHit" @click="submitThrows">Submit</Button>
      </div>
      <ThrowKeyboard :disabled="maxThrowsHit" @throw="addThrownSegment" />
    </template>
  </NuxtLayout>
</template>
