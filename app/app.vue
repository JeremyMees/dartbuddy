<script setup lang="ts">
const store = usePlayerStore()
</script>

<template>
  <main class="pt-4 px-4 sm:px-10">
    <h1>heading 1</h1>
    <h2>heading 2</h2>
    <h3>heading 3</h3>
    <h4>heading 4</h4>
    <h5>heading 5</h5>
    <h6>heading 6</h6>
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
