export function generateAveragePercent<T>(items: T[], key: keyof T): number {
  if (items.length === 0) return 0

  const total = items.reduce(
    (sum, item) =>
      isNaN(item[key] as unknown as number)
        ? sum
        : sum + (item[key] as unknown as number),
    0,
  )

  return total / items.length
}
