<script lang="ts" setup>
import type { HTMLAttributes } from 'vue'

const props = defineProps<{
  message: string
  retryFn?: () => void
  class?: HTMLAttributes['class']
}>()
</script>

<template>
  <Empty :class="cn('w-full', props.class)">
    <EmptyHeader>
      <EmptyMedia variant="icon">
        <Icon name="hugeicons:alert-02" class="text-destructive" />
      </EmptyMedia>
      <EmptyTitle>Something went wrong</EmptyTitle>
      <EmptyDescription>
        {{ message }}
      </EmptyDescription>
    </EmptyHeader>
    <EmptyContent v-if="retryFn">
      <Button variant="outline" size="sm" @click="retryFn">
        <Icon name="hugeicons:refresh" />
        Retry
      </Button>
    </EmptyContent>
  </Empty>
</template>
