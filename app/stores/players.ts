export const usePlayerStore = defineStore('player', () => {
  const players = ref<User[]>([])

  return { players }
})
