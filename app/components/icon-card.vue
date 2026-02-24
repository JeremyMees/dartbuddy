<script setup lang="ts">
defineProps<{ icon: string }>()
</script>

<template>
  <div
    class="bg-primary/10 text-primary rounded-lg p-4 border border-primary flex items-center gap-6"
  >
    <div>
      <Icon data-test-icon :name="icon" class="size-10!" />
    </div>
    <div>
      <slot />
    </div>
  </div>
</template>
