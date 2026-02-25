<script lang="ts" setup>
defineProps<{
  label: string
  stat?: string | number
}>()
</script>

<template>
  <Card>
    <CardHeader>
      <span data-test-label class="text-sm text-muted-foreground">
        {{ label }}
      </span>
    </CardHeader>
    <CardContent data-test-stat class="pt-0">
      <slot>
        <span class="text-3xl font-bold">
          {{ stat }}
        </span>
      </slot>
    </CardContent>
  </Card>
</template>
