export function generateAverage<T>(items: T[], key: keyof T): number {
  if (items.length === 0) return 0

  const total = items.reduce(
    (sum, item) =>
      isNaN(item[key] as unknown as number)
        ? sum
        : sum + (item[key] as unknown as number),
    0,
  )

  return Math.round(total / items.length)
}

export function calculateTrendDirection<T extends { createdAt: string | Date }>(
  items: T[],
  key: keyof T,
): TrendResult {
  if (items.length < 2) return { direction: 'normal', change: 0 }

  const sorted = [...items].sort(
    (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
  )

  const mid = Math.floor(sorted.length / 2)
  const olderHalf = sorted.slice(0, mid)
  const newerHalf = sorted.slice(mid)
  const olderAvg = generateAverage(olderHalf, key)
  const newerAvg = generateAverage(newerHalf, key)

  const change =
    olderAvg === 0
      ? newerAvg === 0
        ? 0
        : 100
      : ((newerAvg - olderAvg) / Math.abs(olderAvg)) * 100

  const rounded = Math.round(change)

  const direction: TrendDirection =
    rounded > 0 ? 'up' : rounded < 0 ? 'down' : 'normal'

  return { direction, change: rounded }
}
