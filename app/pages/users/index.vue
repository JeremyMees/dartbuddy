<script setup lang="ts">
const {
  data: users,
  pending,
  error,
  refresh,
} = await useAsyncData('users', (_nuxtApp, { signal }) =>
  $fetch<User[]>('/api/users', { signal }),
)
const dialogOpen = ref(false)
const selectedUser = ref<User>()

async function deleteUser(id: User['id']) {
  try {
    await $fetch(`/api/users/${id}`, {
      method: 'DELETE',
    })

    await refreshNuxtData('users')
  } catch (error) {
    console.error('Error deleting user:', error)
  }
}
</script>

<template>
  <NuxtLayout>
    <div class="flex w-full justify-between items-center gap-2 flex-wrap">
      <h2>Users</h2>

      <Button :disabled="pending || error" @click="dialogOpen = true">
        <Icon name="hugeicons:add-01" />
        Create user
      </Button>
    </div>

    <Spinner v-if="pending" class="mx-auto my-8 size-10!" />

    <ErrorMessage
      v-else-if="error"
      :message="error.message"
      :retry-fn="refresh"
    />

    <Empty v-else-if="!users?.length" class="w-full">
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <Icon name="hugeicons:user" />
        </EmptyMedia>
        <EmptyTitle>No users found</EmptyTitle>
        <EmptyDescription>
          There are no users yet. Click the button above to create your first
          user.
        </EmptyDescription>
      </EmptyHeader>
    </Empty>

    <div v-else class="border rounded-lg w-full">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow v-for="user in users" :key="user.id">
            <TableCell>
              {{ user.firstName }}
              "{{ user.nickName }}"
              {{ user.lastName }}
            </TableCell>
            <TableCell>
              <div class="flex items-center gap-2">
                <Button variant="outline" size="icon" disabled>
                  <Icon name="hugeicons:chart-01" />
                </Button>

                <Button
                  variant="outline"
                  size="icon"
                  @click="
                    () => {
                      selectedUser = user
                      dialogOpen = true
                    }
                  "
                >
                  <Icon name="hugeicons:user-edit-01" />
                </Button>

                <AlertDialog>
                  <AlertDialogTrigger as-child>
                    <Button variant="outline" size="icon">
                      <Icon
                        name="hugeicons:delete-01"
                        class="text-destructive"
                      />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>
                        Are you absolutely sure?
                      </AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone. This will permanently
                        delete this user and remove all associated data.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel> Cancel </AlertDialogCancel>
                      <AlertDialogAction @click="deleteUser(user.id)">
                        Continue
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>

    <Dialog
      v-model:open="dialogOpen"
      @update:open="
        (open) => {
          if (!open) selectedUser = undefined
        }
      "
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{{
            selectedUser ? 'Edit User' : 'Create User'
          }}</DialogTitle>
        </DialogHeader>
        <FormUser :user="selectedUser" @saved="dialogOpen = false" />
      </DialogContent>
    </Dialog>
  </NuxtLayout>
</template>
