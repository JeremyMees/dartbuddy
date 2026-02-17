<script setup lang="ts">
const {
  thrownSegments,
  maxThrowsHit,
  totalThrowScore,
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
    <pre>
      {{ thrownSegments }}
    </pre>
    <pre>Total Score: {{ totalThrowScore }}</pre>
    <template #bottom>
      <div
        :class="thrownSegments.length && 'mb-2'"
        class="pt-4 grid grid-cols-4 gap-2 items-center border-t"
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
