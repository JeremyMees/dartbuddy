export function useThrownSegments() {
  const thrownSegments = ref<Segment[]>([])

  const maxThrowsHit = computed(() => thrownSegments.value.length >= 3)

  const totalThrowScore = computed(() =>
    thrownSegments.value.reduce((total, segment) => {
      return total + calculateSegmentScore(segment)
    }, 0),
  )

  function addThrownSegment(segment: Segment) {
    if (maxThrowsHit.value) return

    thrownSegments.value.push(segment)
  }

  function resetThrownSegments() {
    thrownSegments.value = []
  }

  function removeThrownSegment(segment: Segment) {
    const index = thrownSegments.value.indexOf(segment)

    if (index !== -1) thrownSegments.value.splice(index, 1)
  }

  return {
    thrownSegments,
    maxThrowsHit,
    totalThrowScore,
    addThrownSegment,
    resetThrownSegments,
    removeThrownSegment,
  }
}
