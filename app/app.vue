<script setup lang="ts">
const store = usePlayerStore()
</script>

<template>
  <main class="px-4">
    <Icon name="hugeicons:dart" />
    <Dialog>
      <DialogTrigger as-child>
        <Button>Hello world</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Are you absolutely sure?</DialogTitle>
          <DialogDescription>
            This action cannot be undone. This will permanently delete your
            account and remove your data from our servers.
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
    <pre
      >{{ store.players }}
    </pre>
  </main>
</template>
