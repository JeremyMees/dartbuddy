export function getAverage<T>(items: T[], key: keyof T): number {
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

export function getHighest<T>(items: T[], key: keyof T): number {
  if (items.length === 0) return 0

  return items.reduce(
    (highest, item) =>
      (item[key] as unknown as number) > highest
        ? (item[key] as unknown as number)
        : highest,
    0,
  )
}

export function getTrendDirection<T extends { createdAt: string | Date }>(
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
  const olderAvg = getAverage(olderHalf, key)
  const newerAvg = getAverage(newerHalf, key)

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

export function getBestGame<T>(games: T[], key: keyof T): T | null {
  if (!games.length) return null

  return games.reduce((best, game) =>
    (game[key] as unknown as number) > (best[key] as unknown as number)
      ? game
      : best,
  )
}

export function getScoreDistribution<T>(
  games: T[],
  key: keyof T,
): Record<string, number> {
  return games.reduce<Record<string, number>>((distribution, game) => {
    distribution[game[key] as unknown as string] =
      (distribution[game[key] as unknown as string] ?? 0) + 1
    return distribution
  }, {})
}

export function getRecentGames<T extends { createdAt: string | Date }>(
  games: T[],
  count = 5,
): T[] {
  return [...games]
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    )
    .slice(0, count)
}

export function getScoreAverageByDate<T extends { createdAt: string | Date }>(
  games: T[],
  key: keyof T,
): { label: string; data: Record<string, number> }[] {
  const grouped = games.reduce<Record<string, number[]>>((acc, game) => {
    const date = formatDate(new Date(game.createdAt))
    const score = game[key] as unknown as number

    if (!isNaN(score)) {
      acc[date] ??= []
      acc[date].push(score)
    }

    return acc
  }, {})

  const sortedAverages = Object.entries(grouped)
    .map(([date, scores]): [string, number] => [
      date,
      Math.round(scores.reduce((a, b) => a + b, 0) / scores.length),
    ])
    .sort((a, b) => parseChartDate(a[0]) - parseChartDate(b[0]))

  if (!sortedAverages.length) {
    return []
  }

  return [
    {
      label: 'Score Trend',
      data: Object.fromEntries(sortedAverages),
    },
  ]
}

export function getPercentage<T>(
  items: T[],
  dividendKey: keyof T,
  divisorKey: keyof T,
): number {
  if (items.length === 0) return 0

  const averageDividend = getAverage(items, dividendKey)
  const averageDivisor = getAverage(items, divisorKey)

  if (averageDivisor === 0) return 0

  return Math.round((averageDividend / averageDivisor) * 100)
}
