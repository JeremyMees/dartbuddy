export function isBust(
  outType: OutType,
  remaining: number,
  lastSegment: Segment | undefined,
): boolean {
  if (!outType || remaining < 0) return true

  if (remaining === 1 && outType !== 'STRAIGHT') return true

  if (remaining === 0 && lastSegment) {
    if (outType === 'DOUBLE') {
      return !lastSegment.startsWith('D')
    }
    if (outType === 'MASTER') {
      return !lastSegment.startsWith('D') && !lastSegment.startsWith('T')
    }
  }

  return false
}
