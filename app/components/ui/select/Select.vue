<script setup lang="ts">
import type { SelectRootEmits, SelectRootProps } from 'reka-ui'
import { SelectRoot, useForwardPropsEmits } from 'reka-ui'
import { useTiks } from '@rexa-developer/tiks/vue'

const props = defineProps<SelectRootProps>()
const emits = defineEmits<SelectRootEmits>()

const forwarded = useForwardPropsEmits(props, emits)

const { click, swoosh } = useTiks()
</script>

<template>
  <SelectRoot
    v-slot="slotProps"
    data-slot="select"
    v-bind="forwarded"
    @update:open="
      (open) => {
        if (open) click()
        else swoosh()
      }
    "
  >
    <slot v-bind="slotProps" />
  </SelectRoot>
</template>
