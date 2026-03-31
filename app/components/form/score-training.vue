<script lang="ts" setup>
import { toTypedSchema } from '@vee-validate/zod'
import { useForm, Field as VeeField } from 'vee-validate'
import { createScoreTrainingGameSchema } from '#shared/form-schemas'

const emit = defineEmits<{
  back: []
  created: []
}>()

const formSchema = toTypedSchema(createScoreTrainingGameSchema)

const { handleSubmit, resetForm } = useForm({
  validationSchema: formSchema,
})

const onSubmit = handleSubmit(async (data) => {
  try {
    await $fetch('/api/games/score-training', {
      method: 'POST',
      body: data,
    })

    resetForm()
    emit('created')
  } catch (error) {
    console.error('Error creating game:', error)
  }
})
</script>

<template>
  <form id="score-training" @submit="onSubmit">
    <div class="p-4 pb-0 flex flex-col gap-2">
      <VeeField v-slot="{ field, errors }" name="total-score">
        <Field :data-invalid="!!errors.length">
          <FieldLabel for="score-training--total-score">
            Total Score
          </FieldLabel>
          <Input
            id="score-training--total-score"
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
      <VeeField v-slot="{ field, errors }" name="highest-score">
        <Field :data-invalid="!!errors.length">
          <FieldLabel for="score-training--highest-score">
            Highest Score
          </FieldLabel>
          <Input
            id="score-training--highest-score"
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
      <VeeField v-slot="{ field, errors }" name="one-eighty-count">
        <Field :data-invalid="!!errors.length">
          <FieldLabel for="score-training--one-eighty-count">
            180 Count
          </FieldLabel>
          <Input
            id="score-training--one-eighty-count"
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
      <VeeField v-slot="{ field, errors }" name="three-dart-average">
        <Field :data-invalid="!!errors.length">
          <FieldLabel for="score-training--three-dart-average">
            Three Dart Average
          </FieldLabel>
          <Input
            id="score-training--three-dart-average"
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
      <VeeField v-slot="{ field, errors }" name="one-dart-average">
        <Field :data-invalid="!!errors.length">
          <FieldLabel for="score-training--one-dart-average">
            One Dart Average
          </FieldLabel>
          <Input
            id="score-training--one-dart-average"
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
