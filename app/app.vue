<script setup lang="ts">
const store = usePlayerStore()
</script>

<template>
  <div>
    <NuxtRouteAnnouncer />
    <Icon name="hugeicons:dart" />
    <Button>Hello world</Button>
    <pre
      >{{ store.players }}
    </pre>
  </div>
</template>
