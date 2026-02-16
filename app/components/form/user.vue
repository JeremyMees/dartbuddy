<script lang="ts" setup>
import { toTypedSchema } from '@vee-validate/zod'
import { useForm, Field as VeeField } from 'vee-validate'
import { userCreateSchema, userUpdateSchema } from '#shared/form-schemas/user'

const props = defineProps<{ user?: User }>()
const emit = defineEmits<(event: 'saved') => void>()

const formSchema = toTypedSchema(
  props.user ? userUpdateSchema : userCreateSchema,
)

const { handleSubmit, resetForm, setValues } = useForm({
  validationSchema: formSchema,
  initialValues: {
    firstName: props.user?.firstName || '',
    lastName: props.user?.lastName || '',
    nickName: props.user?.nickName || '',
  },
})

watch(
  () => props.user,
  (user) => {
    setValues({
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      nickName: user?.nickName || '',
    })
  },
  { immediate: true },
)

const onSubmit = handleSubmit(async (data) => {
  try {
    const fetchOptions = {
      body: data,
      async onResponse() {
        await refreshNuxtData('users')
      },
    }

    if (props.user) {
      await $fetch(`/api/users/${props.user.id}`, {
        method: 'PUT',
        ...fetchOptions,
      })
    } else {
      await $fetch('/api/users', {
        method: 'POST',
        ...fetchOptions,
      })
    }

    resetForm()
    emit('saved')
  } catch (error) {
    console.error('Error updating user:', error)
  }
})
</script>

<template>
  <form id="user" class="flex flex-col gap-4" @submit="onSubmit">
    <VeeField v-slot="{ field, errors }" name="firstName">
      <Field :data-invalid="!!errors.length">
        <FieldLabel for="user-firstName"> First Name </FieldLabel>
        <Input
          id="user-firstName"
          :name="field.name"
          :model-value="field.value"
          :aria-invalid="!!errors.length"
          @update:model-value="field.onChange"
          @blur="field.onBlur"
        />
        <FieldError v-if="errors.length" :errors="errors" />
      </Field>
    </VeeField>
    <VeeField v-slot="{ field, errors }" name="lastName">
      <Field :data-invalid="!!errors.length">
        <FieldLabel for="user-lastName"> Last Name </FieldLabel>
        <Input
          id="user-lastName"
          :name="field.name"
          :model-value="field.value"
          :aria-invalid="!!errors.length"
          @update:model-value="field.onChange"
          @blur="field.onBlur"
        />
        <FieldError v-if="errors.length" :errors="errors" />
      </Field>
    </VeeField>
    <VeeField v-slot="{ field, errors }" name="nickName">
      <Field :data-invalid="!!errors.length">
        <FieldLabel for="user-nickName"> Nick Name </FieldLabel>
        <Input
          id="user-nickName"
          :name="field.name"
          :model-value="field.value"
          :aria-invalid="!!errors.length"
          @update:model-value="field.onChange"
          @blur="field.onBlur"
        />
        <FieldError v-if="errors.length" :errors="errors" />
      </Field>
    </VeeField>
    <Button type="submit">
      {{ props.user ? 'Update User' : 'Create User' }}
    </Button>
  </form>
</template>
