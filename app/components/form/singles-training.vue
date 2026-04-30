<script lang="ts" setup>
import { toTypedSchema } from '@vee-validate/zod'
import { useForm, Field as VeeField } from 'vee-validate'
import { createSinglesTrainingGameSchema } from '#shared/form-schemas'
import { useMutation } from '@tanstack/vue-query'
import type { z } from 'zod'
import { useTiks } from '@rexa-developer/tiks/vue'

const emit = defineEmits<{
  back: []
  created: []
}>()

const { success, error } = useTiks()

type FormData = z.infer<typeof createSinglesTrainingGameSchema>

const formSchema = toTypedSchema(createSinglesTrainingGameSchema)

const { handleSubmit, resetForm } = useForm({
  validationSchema: formSchema,
})

const { mutate } = useMutation({
  mutationFn: (game: FormData) =>
    $fetch<SinglesTrainingGame>('/api/games/singles-training', {
      method: 'POST',
      body: game,
    }),
  onSuccess: () => {
    success()
    resetForm()
    emit('created')
  },
  onError: () => error(),
})

const onSubmit = handleSubmit((data) => mutate(data))
</script>

<template>
  <form id="singles-training" @submit="onSubmit">
    <div class="p-4 pb-0 flex flex-col gap-2">
      <VeeField v-slot="{ field, errors }" name="score">
        <Field :data-invalid="!!errors.length">
          <FieldLabel for="singles-training--score"> Score </FieldLabel>
          <Input
            id="singles-training--score"
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
