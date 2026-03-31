<script lang="ts" setup>
import type { HTMLAttributes } from 'vue'

const props = defineProps<{
  label: string
  stat?: string | number
  class?: HTMLAttributes['class']
}>()
</script>

<template>
  <Card :class="cn('items-center', props.class)">
    <CardHeader class="w-full text-center">
      <span data-test-label class="text-sm text-muted-foreground">
        {{ label }}
      </span>
    </CardHeader>
    <CardContent data-test-stat class="pt-0 flex-1">
      <slot>
        <span class="text-3xl font-bold">
          {{ stat }}
        </span>
      </slot>
    </CardContent>
    <CardFooter v-if="$slots.footer" data-test-footer>
      <slot name="footer" />
    </CardFooter>
  </Card>
</template>
