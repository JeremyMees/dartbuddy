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
