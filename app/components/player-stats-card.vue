<script setup lang="ts">
import type { PlayerStats } from '~~/shared/types/player'

defineProps<PlayerStats>()
</script>

<template>
  <div
    class="border rounded-lg w-full py-2 flex flex-col gap-2 transition-colors duration-300"
  >
    <span class="text-lg px-4">
      {{ firstName }}
      <span class="font-bold">"{{ nickName }}"</span>
      {{ lastName }}
    </span>

    <div class="px-4 pt-1 flex gap-4 items-center justify-between">
      <div class="text-4xl font-black">
        {{ points }}
      </div>
      <div class="flex gap-4">
        <IconStat icon="hugeicons:medal-02" name="Sets" :value="sets" />
        <IconStat icon="hugeicons:stack-star" name="Legs" :value="legs" />
        <IconStat icon="hugeicons:dart" name="Darts" :value="thrown" />
      </div>
    </div>

    <Separator />

    <div class="px-4 grid grid-cols-3 gap-x-4 gap-y-3">
      <SingleStat name="3-dart avg" :value="average" />
      <SingleStat name="Best turn" :value="highestTurn || '-'" />
      <SingleStat name="180s" :value="oneEighties" />
      <SingleStat name="Best checkout" :value="highestCheckout || '-'" />
      <SingleStat name="Checkout tries" :value="checkoutAttempts" />
      <SingleStat name="Busts" :value="busts" />
    </div>
  </div>
</template>
