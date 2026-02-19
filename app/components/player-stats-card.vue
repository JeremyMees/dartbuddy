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
      <div class="flex flex-col gap-0.5">
        <span class="text-xs text-muted-foreground">3-dart avg</span>
        <span class="font-bold">{{ average }}</span>
      </div>
      <div class="flex flex-col gap-0.5">
        <span class="text-xs text-muted-foreground">Best turn</span>
        <span class="font-bold">{{ highestTurn || '—' }}</span>
      </div>
      <div class="flex flex-col gap-0.5">
        <span class="text-xs text-muted-foreground">180s</span>
        <span class="font-bold">{{ oneEighties }}</span>
      </div>
      <div class="flex flex-col gap-0.5">
        <span class="text-xs text-muted-foreground">Best checkout</span>
        <span class="font-bold">{{ highestCheckout || '—' }}</span>
      </div>
      <div class="flex flex-col gap-0.5">
        <span class="text-xs text-muted-foreground">Checkout tries</span>
        <span class="font-bold">{{ checkoutAttempts }}</span>
      </div>
      <div class="flex flex-col gap-0.5">
        <span class="text-xs text-muted-foreground">Busts</span>
        <span class="font-bold">{{ busts }}</span>
      </div>
    </div>
  </div>
</template>
