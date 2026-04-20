import dayjs from 'dayjs'

export function getAverage<T>(items: T[], key: keyof T): number {
  if (items.length === 0) return 0

  const total = items.reduce((sum, item) => {
    const value = item[key] as unknown

    if (typeof value !== 'number' || Number.isNaN(value)) {
      return sum
    }

    return sum + value
  }, 0)

  return Math.round(total / items.length)
}

export function getHighest<T>(items: T[], key: keyof T): number {
  if (items.length === 0) return 0

  return items.reduce(
    (highest, item) =>
      (item[key] as number) > highest ? (item[key] as number) : highest,
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

  return {
    direction: rounded > 0 ? 'up' : rounded < 0 ? 'down' : 'normal',
    change: rounded,
  }
}

export function getBestGame<T>(games: T[], key: keyof T): T | null {
  if (games.length === 0) return null

  return games.reduce((best, game) =>
    (game[key] as number) > (best[key] as number) ? game : best,
  )
}

export function getScoreDistribution<T>(
  games: T[],
  key: keyof T,
): BarDataSet[] {
  const data = games.reduce<Record<string, number>>((distribution, game) => {
    const score = String(game[key])

    distribution[score] = (distribution[score] ?? 0) + 1

    return distribution
  }, {})

  if (Object.keys(data).length === 0) {
    return []
  }

  return [
    {
      label: 'Score Distribution',
      data,
      sort: sortEntriesByNumericValue,
    },
  ]
}

export function getScoreAverageByDate<T extends { createdAt: string | Date }>(
  games: T[],
  key: keyof T,
): LineDataSet[] {
  const grouped = games.reduce<
    Record<string, { label: string; scores: number[] }>
  >((acc, game) => {
    const dateKey = formatDateKey(game.createdAt)
    const score = game[key] as number

    if (dateKey !== null && !Number.isNaN(score)) {
      acc[dateKey] ??= { label: formatDateLabel(game.createdAt), scores: [] }
      acc[dateKey].scores.push(score)
    }

    return acc
  }, {})

  const sortedAverages = Object.entries(grouped)
    .sort(([leftDate], [rightDate]) => leftDate.localeCompare(rightDate))
    .map(([, { label, scores }]): [string, number] => [
      label,
      Math.round(scores.reduce((sum, score) => sum + score, 0) / scores.length),
    ])

  if (sortedAverages.length === 0) {
    return []
  }

  return [
    {
      label: 'Score Trend',
      data: Object.fromEntries(sortedAverages),
    },
  ]
}

export function getRatioPercentage(dividend: number, divisor: number): number {
  if (divisor === 0) return 0

  return Math.round((dividend / divisor) * 100)
}

export function getMatchScoreTrend<
  T extends { threeDartAverage: number; firstNineDartAverage: number },
>(games: T[]): LineDataSet[] {
  return [
    {
      label: '3-Dart Average',
      data: Object.fromEntries(
        games.map((game, index) => [`M${index + 1}`, game.threeDartAverage]),
      ),
    },
    {
      label: 'First 9-Dart Average',
      data: Object.fromEntries(
        games.map((game, index) => [
          `M${index + 1}`,
          game.firstNineDartAverage,
        ]),
      ),
    },
  ]
}

export function getWinLossDistribution<
  T extends { opponent: string; hasWon: boolean; _count: { _all: number } },
>(groupedResults: T[]): PieDataSet[] {
  return [
    {
      label: 'Win/Loss Distribution',
      data: Object.fromEntries(
        groupedResults.map((result) => [
          result.hasWon
            ? `Won vs ${result.opponent}`
            : `Lost vs ${result.opponent}`,
          result._count._all,
        ]),
      ),
    },
  ]
}

function formatDateKey(date: Date | string) {
  const parsedDate = dayjs(date)

  return parsedDate.isValid() ? parsedDate.format('YYYY-MM-DD') : null
}

function formatDateLabel(date: Date | string) {
  return dayjs(date).format('DD/MM/YY')
}

function parseNumericLabel(label: string) {
  const value = Number(label)

  return Number.isNaN(value) ? null : value
}

function sortEntriesByNumericValue(a: [string, number], b: [string, number]) {
  const leftValue = parseNumericLabel(a[0])
  const rightValue = parseNumericLabel(b[0])

  if (leftValue === null || rightValue === null) {
    return 0
  }

  return leftValue - rightValue
}
