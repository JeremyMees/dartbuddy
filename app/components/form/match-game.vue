<script lang="ts" setup>
import { toTypedSchema } from '@vee-validate/zod'
import { useForm, Field as VeeField } from 'vee-validate'
import { createMatchGameSchema } from '#shared/form-schemas'
import { useMutation } from '@tanstack/vue-query'
import type { z } from 'zod'

const emit = defineEmits<{
  back: []
  created: []
}>()

type FormData = z.infer<typeof createMatchGameSchema>

const formSchema = toTypedSchema(createMatchGameSchema)

const { handleSubmit, resetForm } = useForm({
  validationSchema: formSchema,
  initialValues: {
    hasWon: false,
  },
})

const { mutate } = useMutation({
  mutationFn: (game: FormData) =>
    $fetch<MatchGame>('/api/games/match-game', {
      method: 'POST',
      body: game,
    }),
  onSuccess: () => {
    resetForm()
    emit('created')
  },
})

const onSubmit = handleSubmit((data) => mutate(data))
</script>

<template>
  <form id="match-game" @submit="onSubmit">
    <div class="p-4 pb-0 flex flex-col gap-2">
      <div class="grid grid-cols-2 gap-4">
        <div>
          <VeeField v-slot="{ field, errors }" name="opponent">
            <Select
              :name="field.name"
              :model-value="field.value"
              @update:model-value="field.onChange"
              @blur="field.onBlur"
            >
              <FieldLabel for="match-game--opponent"> Opponent </FieldLabel>
              <SelectTrigger
                id="match-game--opponent"
                :aria-invalid="!!errors.length"
                class="w-full"
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="opponent"> Opponent </SelectItem>
                <SelectSeparator />
                <SelectItem
                  v-for="item in Array.from({ length: 18 }, (_, i) => ({
                    value: `dartbot-${i + 1}`,
                    label: `Dartbot (${i + 1})`,
                  }))"
                  :key="item.value"
                  :value="item.value"
                >
                  {{ item.label }}
                </SelectItem>
              </SelectContent>
              <FieldError v-if="errors.length" :errors="errors" />
            </Select>
          </VeeField>
        </div>
        <div class="flex items-center gap-2">
          <VeeField v-slot="{ field, errors }" name="hasWon">
            <Checkbox
              id="match-game--has-won"
              :model-value="field.value"
              :aria-invalid="!!errors.length"
              @update:model-value="(checked) => field.onChange(checked)"
            />
            <FieldLabel for="match-game--has-won" class="font-normal">
              Won game
            </FieldLabel>
          </VeeField>
        </div>
      </div>

      <div class="flex gap-4">
        <VeeField v-slot="{ field, errors }" name="threeDartAverage">
          <Field :data-invalid="!!errors.length">
            <FieldLabel for="match-game--three-dart-average">
              3 Dart Average
            </FieldLabel>
            <Input
              id="match-game--three-dart-average"
              type="number"
              step=".01"
              :name="field.name"
              :model-value="field.value"
              :aria-invalid="!!errors.length"
              @update:model-value="(val) => field.onChange(Number(val))"
              @blur="field.onBlur"
            />
            <FieldError v-if="errors.length" :errors="errors" />
          </Field>
        </VeeField>
        <VeeField v-slot="{ field, errors }" name="firstNineDartAverage">
          <Field :data-invalid="!!errors.length">
            <FieldLabel for="match-game--first-nine-dart-average">
              First 9 Dart Average
            </FieldLabel>
            <Input
              id="match-game--first-nine-dart-average"
              type="number"
              step=".01"
              :name="field.name"
              :model-value="field.value"
              :aria-invalid="!!errors.length"
              @update:model-value="(val) => field.onChange(Number(val))"
              @blur="field.onBlur"
            />
            <FieldError v-if="errors.length" :errors="errors" />
          </Field>
        </VeeField>
      </div>

      <div class="flex gap-4">
        <VeeField v-slot="{ field, errors }" name="checkoutThrown">
          <Field :data-invalid="!!errors.length">
            <FieldLabel for="match-game--checkout-thrown">
              Checkout Thrown
            </FieldLabel>
            <Input
              id="match-game--checkout-thrown"
              type="number"
              :name="field.name"
              :model-value="field.value"
              :aria-invalid="!!errors.length"
              @update:model-value="(val) => field.onChange(Number(val))"
              @blur="field.onBlur"
            />
            <FieldError v-if="errors.length" :errors="errors" />
          </Field>
        </VeeField>
        <VeeField v-slot="{ field, errors }" name="checkoutHits">
          <Field :data-invalid="!!errors.length">
            <FieldLabel for="match-game--checkout-hits">
              Checkout Hits
            </FieldLabel>
            <Input
              id="match-game--checkout-hits"
              type="number"
              :name="field.name"
              :model-value="field.value"
              :aria-invalid="!!errors.length"
              @update:model-value="(val) => field.onChange(Number(val))"
              @blur="field.onBlur"
            />
            <FieldError v-if="errors.length" :errors="errors" />
          </Field>
        </VeeField>
      </div>

      <div class="flex gap-4">
        <VeeField v-slot="{ field, errors }" name="highestFinish">
          <Field :data-invalid="!!errors.length">
            <FieldLabel for="match-game--highest-finish">
              Highest Finish
            </FieldLabel>
            <Input
              id="match-game--highest-finish"
              type="number"
              :name="field.name"
              :model-value="field.value"
              :aria-invalid="!!errors.length"
              @update:model-value="(val) => field.onChange(Number(val))"
              @blur="field.onBlur"
            />
            <FieldError v-if="errors.length" :errors="errors" />
          </Field>
        </VeeField>
        <VeeField v-slot="{ field, errors }" name="highestScore">
          <Field :data-invalid="!!errors.length">
            <FieldLabel for="match-game--highest-score">
              Highest Score
            </FieldLabel>
            <Input
              id="match-game--highest-score"
              type="number"
              :name="field.name"
              :model-value="field.value"
              :aria-invalid="!!errors.length"
              @update:model-value="(val) => field.onChange(Number(val))"
              @blur="field.onBlur"
            />
            <FieldError v-if="errors.length" :errors="errors" />
          </Field>
        </VeeField>
      </div>

      <div class="flex gap-4">
        <VeeField v-slot="{ field, errors }" name="bestLeg">
          <Field :data-invalid="!!errors.length">
            <FieldLabel for="match-game--best-leg"> Best Leg </FieldLabel>
            <Input
              id="match-game--best-leg"
              type="number"
              :name="field.name"
              :model-value="field.value"
              :aria-invalid="!!errors.length"
              @update:model-value="(val) => field.onChange(Number(val))"
              @blur="field.onBlur"
            />
            <FieldError v-if="errors.length" :errors="errors" />
          </Field>
        </VeeField>
        <VeeField v-slot="{ field, errors }" name="worstLeg">
          <Field :data-invalid="!!errors.length">
            <FieldLabel for="match-game--worst-leg"> Worst Leg </FieldLabel>
            <Input
              id="match-game--worst-leg"
              type="number"
              :name="field.name"
              :model-value="field.value"
              :aria-invalid="!!errors.length"
              @update:model-value="(val) => field.onChange(Number(val))"
              @blur="field.onBlur"
            />
            <FieldError v-if="errors.length" :errors="errors" />
          </Field>
        </VeeField>
      </div>
    </div>

    <ButtonGroup class="p-4 w-full">
      <Button
        variant="outline"
        type="button"
        class="flex-1"
        @click="emit('back')"
      >
        <Icon name="hugeicons:arrow-left-02" />
        Back
      </Button>
      <Button type="submit" class="flex-1">
        <Icon name="hugeicons:add-01" />
        Submit
      </Button>
    </ButtonGroup>
  </form>
</template>
