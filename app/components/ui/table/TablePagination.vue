<script setup lang="ts">
import type { HTMLAttributes } from 'vue'

const props = defineProps<{
  page: number
  perPage: number
  total: number
  class?: HTMLAttributes['class']
}>()

const totalPages = computed(() => Math.ceil(props.total / props.perPage))
</script>

<template>
  <div
    :class="cn('border-t p-2 flex items-center justify-between', props.class)"
  >
    <div class="text-muted-foreground text-sm">
      {{ `Page ${page + 1}/${totalPages}` }}
    </div>

    <Pagination
      v-slot="{ page: currentPage }"
      :items-per-page="props.perPage"
      :total="props.total"
      class="w-fit mx-0"
    >
      <PaginationContent v-slot="{ items }">
        <PaginationPrevious size="icon-sm" />
        <template v-for="(item, index) in items" :key="index">
          <PaginationItem
            v-if="item.type === 'page'"
            :value="item.value"
            :is-active="item.value === currentPage"
            size="icon-sm"
          >
            {{ item.value }}
          </PaginationItem>
        </template>
        <PaginationNext size="icon-sm" />
      </PaginationContent>
    </Pagination>
  </div>
</template>
