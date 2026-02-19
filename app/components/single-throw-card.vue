<script setup lang="ts">
defineEmits<{ remove: [] }>()
defineProps<{ segment: Segment }>()
</script>

<template>
  <div class="border rounded-lg flex grow gap-2 items-center">
    <span class="text-xl font-bold pl-2 py-0.5">
      {{ segment }}
    </span>
    <button
      class="ml-auto flex flex-col items-center justify-center pr-2 py-0.5"
      @click="$emit('remove')"
    >
      <Icon name="hugeicons:delete-01" />
    </button>
  </div>
</template>
