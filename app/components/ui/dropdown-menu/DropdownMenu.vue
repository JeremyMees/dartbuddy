<script setup lang="ts">
import type { DropdownMenuRootEmits, DropdownMenuRootProps } from 'reka-ui'
import { DropdownMenuRoot, useForwardPropsEmits } from 'reka-ui'
import { useTiks } from '@rexa-developer/tiks/vue'

const props = defineProps<DropdownMenuRootProps>()
const emits = defineEmits<DropdownMenuRootEmits>()

const forwarded = useForwardPropsEmits(props, emits)

const { click, swoosh } = useTiks()
</script>

<template>
  <DropdownMenuRoot
    v-slot="slotProps"
    data-slot="dropdown-menu"
    v-bind="forwarded"
    @update:open="
      (open) => {
        if (open) click()
        else swoosh()
      }
    "
  >
    <slot v-bind="slotProps" />
  </DropdownMenuRoot>
</template>
