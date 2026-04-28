<script lang="ts" setup>
import { toTypedSchema } from '@vee-validate/zod'
import { useForm, Field as VeeField } from 'vee-validate'
import { createDoublesTrainingGameSchema } from '#shared/form-schemas'
import { useMutation } from '@tanstack/vue-query'
import type { z } from 'zod'

const emit = defineEmits<{
  back: []
  created: []
}>()

type FormData = z.infer<typeof createDoublesTrainingGameSchema>

const formSchema = toTypedSchema(createDoublesTrainingGameSchema)

const { handleSubmit, resetForm } = useForm({
  validationSchema: formSchema,
})

const { mutate } = useMutation({
  mutationFn: (game: FormData) =>
    $fetch<DoublesTrainingGame>('/api/games/doubles-training', {
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
  <form id="doubles-training" @submit="onSubmit">
    <div class="p-4 pb-0 flex flex-col gap-2">
      <VeeField v-slot="{ field, errors }" name="hitPercent">
        <Field :data-invalid="!!errors.length">
          <FieldLabel for="doubles-training--hitPercent">
            Hit Percent
          </FieldLabel>
          <Input
            id="doubles-training--hitPercent"
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
