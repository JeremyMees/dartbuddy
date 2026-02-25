<script lang="ts" setup>
import { checkoutTable } from '~~/constants/checkout-table'
</script>

<template>
  <NuxtLayout>
    <div class="flex w-full justify-between items-center gap-2 flex-wrap">
      <h2>Checkout table</h2>

      <div class="border rounded-lg w-full">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Current score</TableHead>
              <TableHead>Throws</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow
              v-for="[score, checkout] in Object.entries(
                checkoutTable,
              ).reverse()"
              :key="score"
            >
              <TableCell>
                {{ score }}
              </TableCell>
              <TableCell>
                <div class="flex items-center gap-1">
                  <template
                    v-for="(dart, i) in checkout.darts"
                    :key="`${score}-${dart.segment}-${i}`"
                  >
                    <span>
                      {{ dart ? dart.segment : '-' }}
                    </span>
                    <Icon
                      v-if="i !== checkout.darts.length - 1"
                      name="hugeicons:arrow-right-04"
                    />
                  </template>
                </div>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    </div>
  </NuxtLayout>
</template>
