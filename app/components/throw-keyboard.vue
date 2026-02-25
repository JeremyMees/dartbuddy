<script lang="ts" setup>
import type { HTMLAttributes } from 'vue'

defineEmits<{ throw: [Segment] }>()
defineProps<{
  disabled?: boolean
  class?: HTMLAttributes['class']
}>()

const selectedAmount = ref<number | null>(null)

function toggleSelectedAmount(amount: number) {
  if (selectedAmount.value === amount) {
    selectedAmount.value = null
  } else {
    selectedAmount.value = amount
  }
}
</script>

<template>
  <section :class="cn('w-full flex flex-col gap-2', $props.class)">
    <div class="grid grid-cols-7 gap-2">
      <template v-for="i in 20" :key="i">
        <Button
          data-test-segment-button
          :variant="selectedAmount === i ? 'default' : 'outline'"
          :disabled="
            disabled || (selectedAmount !== null && selectedAmount !== i)
          "
          class="w-full"
          @click="toggleSelectedAmount(i)"
        >
          {{ i }}
        </Button>
      </template>
      <Button
        data-test-segment-button
        :variant="selectedAmount === 25 ? 'default' : 'outline'"
        :disabled="
          disabled || (selectedAmount !== null && selectedAmount !== 25)
        "
        class="w-full"
        @click="toggleSelectedAmount(25)"
      >
        25
      </Button>
    </div>

    <div class="grid grid-cols-4 gap-2">
      <Button
        data-test-missed
        variant="outline"
        :disabled="disabled || selectedAmount !== null"
        class="w-full"
        @click="
          () => {
            $emit('throw', 'MISS')
            selectedAmount = null
          }
        "
      >
        Missed
      </Button>
      <Button
        data-test-single
        variant="outline"
        :disabled="disabled || selectedAmount === null"
        class="w-full"
        @click="
          () => {
            $emit('throw', calculateSegment(selectedAmount, 1))
            selectedAmount = null
          }
        "
      >
        Single
      </Button>
      <Button
        data-test-double
        variant="outline"
        :disabled="disabled || selectedAmount === null"
        class="w-full"
        @click="
          () => {
            $emit('throw', calculateSegment(selectedAmount, 2))
            selectedAmount = null
          }
        "
      >
        Double
      </Button>
      <Button
        data-test-triple
        variant="outline"
        :disabled="disabled || selectedAmount === null || selectedAmount === 25"
        class="w-full"
        @click="
          () => {
            $emit('throw', calculateSegment(selectedAmount, 3))
            selectedAmount = null
          }
        "
      >
        Triple
      </Button>
    </div>
  </section>
</template>
