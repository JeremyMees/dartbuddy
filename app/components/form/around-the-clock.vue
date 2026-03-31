<script lang="ts" setup>
import { toTypedSchema } from '@vee-validate/zod'
import { useForm, Field as VeeField } from 'vee-validate'
import { createAroundTheClockGameSchema } from '#shared/form-schemas'

const emit = defineEmits<{
  back: []
  created: []
}>()

const formSchema = toTypedSchema(createAroundTheClockGameSchema)

const { handleSubmit, resetForm } = useForm({
  validationSchema: formSchema,
})

const onSubmit = handleSubmit(async (data) => {
  try {
    await $fetch('/api/games/around-the-clock', {
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
  <form id="around-the-clock" @submit="onSubmit">
    <div class="p-4 pb-0 flex flex-col gap-2">
      <VeeField v-slot="{ field, errors }" name="hitPercent">
        <Field :data-invalid="!!errors.length">
          <FieldLabel for="around-the-clock--hitPercent">
            Hit Percent
          </FieldLabel>
          <Input
            id="around-the-clock--hitPercent"
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

      <VeeField v-slot="{ field, errors }" name="dartsThrown">
        <Field :data-invalid="!!errors.length">
          <FieldLabel for="around-the-clock--dartsThrown">
            Darts Thrown
          </FieldLabel>
          <Input
            id="around-the-clock--dartsThrown"
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
