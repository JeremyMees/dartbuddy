<script lang="ts" setup>
import { toTypedSchema } from '@vee-validate/zod'
import { useForm, Field as VeeField } from 'vee-validate'
import { gameCreateSchema } from '#shared/form-schemas/game'

const { data, pending } = await useLazyAsyncData(
  'users',
  (_nuxtApp, { signal }) =>
    $fetch<{ users: User[]; pagination: PaginationData }>('/api/users', {
      signal,
      params: {
        amount: 20,
      },
    }),
)

const emit = defineEmits<{
  saved: []
  refresh: []
}>()

const formSchema = toTypedSchema(gameCreateSchema)

const { handleSubmit, resetForm } = useForm({
  validationSchema: formSchema,
  initialValues: {
    startScore: 501,
    legsToWin: 6,
    setsToWin: 1,
    outType: 'DOUBLE' as const,
    playerIds: [],
  },
})

const onSubmit = handleSubmit(async (data) => {
  try {
    const game = await $fetch('/api/games', {
      method: 'POST',
      body: data,
    })

    emit('refresh')
    resetForm()
    emit('saved')

    navigateTo(`/game/${game.id}`)
  } catch (error) {
    console.error('Error creating game:', error)
  }
})
</script>

<template>
  <form id="game" class="flex flex-col gap-4" @submit="onSubmit">
    <VeeField v-slot="{ field, errors }" name="playerIds">
      <Field :data-invalid="!!errors.length">
        <FieldLabel for="game-players"> Players </FieldLabel>
        <div
          v-if="pending"
          class="text-sm text-muted-foreground rounded-lg border p-3"
        >
          Loading players...
        </div>

        <div
          v-if="!pending && (!data?.users || data.users.length === 0)"
          class="text-sm text-muted-foreground rounded-lg border p-3"
        >
          No players available. Create players first.
        </div>

        <Select
          v-else-if="data?.users"
          :model-value="field.value"
          multiple
          @update:model-value="field.onChange"
        >
          <SelectTrigger id="game-playerIds">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem
              v-for="user in data.users"
              :key="user.id"
              :value="user.id"
            >
              {{ user.firstName }}
            </SelectItem>
          </SelectContent>
        </Select>

        <FieldError v-if="errors.length" :errors="errors" />
      </Field>
    </VeeField>

    <VeeField v-slot="{ field, errors }" name="startScore">
      <Field :data-invalid="!!errors.length">
        <FieldLabel for="game-startScore"> Start Score </FieldLabel>
        <Input
          id="game-startScore"
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

    <VeeField v-slot="{ field, errors }" name="outType">
      <Field :data-invalid="!!errors.length">
        <FieldLabel for="game-outType"> Out Type </FieldLabel>
        <Select :model-value="field.value" @update:model-value="field.onChange">
          <SelectTrigger id="game-outType">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="DOUBLE">Double Out</SelectItem>
            <SelectItem value="MASTER">Master Out</SelectItem>
            <SelectItem value="STRAIGHT">Straight Out</SelectItem>
          </SelectContent>
        </Select>
        <FieldError v-if="errors.length" :errors="errors" />
      </Field>
    </VeeField>

    <VeeField v-slot="{ field, errors }" name="legsToWin">
      <Field :data-invalid="!!errors.length">
        <FieldLabel for="game-legsToWin"> Legs to Win </FieldLabel>
        <Input
          id="game-legsToWin"
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

    <VeeField v-slot="{ field, errors }" name="setsToWin">
      <Field :data-invalid="!!errors.length">
        <FieldLabel for="game-setsToWin"> Sets to Win </FieldLabel>
        <Input
          id="game-setsToWin"
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

    <Button type="submit"> Create Game </Button>
  </form>
</template>
