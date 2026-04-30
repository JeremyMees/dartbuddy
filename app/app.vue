<script setup lang="ts">
import { useTiks } from '@rexa-developer/tiks/vue'

useTiks({
  volume: 50,
})
</script>

<template>
  <NuxtPwaManifest />
  <NuxtPage />
</template>
