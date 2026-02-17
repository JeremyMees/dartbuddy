<script lang="ts" setup>
import type { HTMLAttributes } from 'vue'

const props = defineProps<{
  class?: HTMLAttributes['class']
}>()

const navigation = [
  {
    name: 'Play',
    icon: 'hugeicons:dart',
    href: '/',
  },
  {
    name: 'Users',
    icon: 'hugeicons:user-group',
    href: '/users',
  },
]
</script>

<template>
  <header
    :class="
      cn(
        'w-full flex items-center justify-center py-2 px-4 sm:px-10 border-t gap-4',
        props.class,
      )
    "
  >
    <NuxtLink
      v-for="item in navigation"
      :key="item.name"
      :to="item.href"
      class="flex items-center gap-2 rounded-lg p-2"
      active-class="ring-2 ring-primary"
    >
      <Icon :name="item.icon" class="size-6! min-w-6!" />
      <span class="sr-only">{{ item.name }}</span>
    </NuxtLink>
  </header>
</template>
