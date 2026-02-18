<script lang="ts" setup>
defineEmits<{ delete: [Game['id']] }>()
defineProps<{ game: GameOverview }>()
</script>

<template>
  <Card>
    <CardHeader class="border-b flex items-center gap-4">
      <div class="flex gap-2 items-center">
        <Icon name="hugeicons:medal-02" />
        <span class="font-bold">
          {{ `${game.sets.length}/${game.setsToWin}` }}
        </span>
      </div>
      <div class="flex gap-2 items-center">
        <Icon name="hugeicons:award-01" />
        <span class="font-bold">{{ game.winner?.firstName || '...' }}</span>
      </div>
      <div class="flex gap-2 items-center">
        <Icon name="hugeicons:calendar-04" />
        <span class="font-bold">{{ formatDate(game.createdAt) }}</span>
      </div>
    </CardHeader>
    <CardContent>
      <ul class="text-sm list-disc list-inside">
        <li v-for="{ player } in game.players" :key="player.id">
          {{ player.firstName }}
          <span class="font-bold">"{{ player.nickName }}"</span>
          {{ player.lastName }}
        </li>
      </ul>
    </CardContent>
    <CardFooter class="gap-2">
      <AlertDialog>
        <AlertDialogTrigger as-child>
          <Button variant="outline" class="grow">
            <Icon name="hugeicons:delete-01" />
            Remove
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle> Are you absolutely sure? </AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete this
              game and remove all associated data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel> Cancel </AlertDialogCancel>
            <AlertDialogAction @click="$emit('delete', game.id)">
              Continue
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <NuxtLink :to="`/game/${game.id}`" as-child class="grow">
        <Button variant="outline" class="w-full">
          <Icon name="hugeicons:dart" />
          Play
        </Button>
      </NuxtLink>
    </CardFooter>
  </Card>
</template>
