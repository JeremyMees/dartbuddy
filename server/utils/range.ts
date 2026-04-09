export function getRangeStartDate(range: GameRange): Date | undefined {
  const now = new Date()

  switch (range) {
    case 'today':
      return new Date(now.getFullYear(), now.getMonth(), now.getDate())
    case 'lastWeek':
      return new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
    case 'lastMonth':
      return new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
    case 'allTime':
    default:
      return undefined
  }
}

export function generateRangeWhereClause(date: Date) {
  return { createdAt: { gte: date } }
}
