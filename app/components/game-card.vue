<script lang="ts" setup>
defineEmits<{ delete: [Game['id']] }>()
defineProps<{ game: GameOverview }>()
</script>

<template>
  <Card>
    <CardHeader class="border-b flex items-center gap-4">
      <div class="flex gap-2 items-center">
        <Icon name="hugeicons:medal-02" />
        <span data-test-sets class="font-bold">
          {{ `${game._count.sets}/${game.setsToWin}` }}
        </span>
      </div>
      <div class="flex gap-2 items-center">
        <Icon name="hugeicons:award-01" />
        <span data-test-winner class="font-bold">{{
          game.winner?.firstName || '...'
        }}</span>
      </div>
      <div class="flex gap-2 items-center">
        <Icon name="hugeicons:calendar-04" />
        <span class="font-bold">{{ formatDate(game.createdAt) }}</span>
      </div>
    </CardHeader>
    <CardContent>
      <ul class="text-sm list-inside flex flex-col gap-y-0.5">
        <li
          v-for="{ player } in game.players"
          :key="player.id"
          data-test-player
          class="flex items-center gap-2"
        >
          <Icon name="hugeicons:user" />
          <span>
            {{ player.firstName }}
            <span class="font-bold">"{{ player.nickName }}"</span>
            {{ player.lastName }}
          </span>
        </li>
      </ul>
    </CardContent>
    <CardFooter>
      <ButtonGroup class="grow">
        <AlertDialog>
          <AlertDialogTrigger as-child>
            <Button variant="outline" class="flex-1">
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
        <NuxtLink :to="`/game/${game.id}`" class="flex-1">
          <Button
            variant="outline"
            class="w-full border-l-0 rounded-l-none"
            data-test-watch-or-play
          >
            <Icon v-if="game.winnerId" name="hugeicons:search-01" />
            <Icon v-else name="hugeicons:dart" />
            {{ game.winnerId ? 'Watch' : 'Play' }}
          </Button>
        </NuxtLink>
      </ButtonGroup>
    </CardFooter>
  </Card>
</template>
