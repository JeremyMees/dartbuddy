import { Prisma } from '#server/generated/prisma/client'
import type { BarDataSet, LineDataSet, TrendResult } from '#shared/types'

type QueryableTable =
  | 'AroundTheClockGame'
  | 'DoublesTrainingGame'
  | 'ScoreTrainingGame'
  | 'SinglesTrainingGame'

type NumericColumn =
  | 'dartsThrown'
  | 'highestScore'
  | 'hitPercent'
  | 'oneEightyCount'
  | 'score'
  | 'threeDartAverage'
  | 'totalScore'

type TrendRow = {
  total_count: bigint
  older_avg: number | null
  newer_avg: number | null
}

type DistributionRow = {
  score: string
  count: bigint
}

type AverageByDateRow = {
  label: string
  average: number | null
}

export async function getTrendDirectionForColumn(
  tableName: QueryableTable,
  columnName: NumericColumn,
  rangeStartDate?: Date,
): Promise<TrendResult> {
  const table = getIdentifier(tableName)
  const column = getIdentifier(columnName)
  const where = getCreatedAtWhereClause(rangeStartDate)

  const [row] = await prisma.$queryRaw<TrendRow[]>(Prisma.sql`
    WITH ranked AS (
      SELECT
        ${column} AS value,
        ROW_NUMBER() OVER (ORDER BY "createdAt" ASC, id ASC) AS row_num,
        COUNT(*) OVER () AS total_count
      FROM ${table}
      ${where}
    )
    SELECT
      MAX(total_count) AS total_count,
      AVG(value) FILTER (WHERE row_num <= FLOOR(total_count / 2.0)) AS older_avg,
      AVG(value) FILTER (WHERE row_num > FLOOR(total_count / 2.0)) AS newer_avg
    FROM ranked
  `)

  const totalCount = Number(row?.total_count ?? 0n)

  if (totalCount < 2) {
    return { direction: 'normal', change: 0 }
  }

  const olderAvg = Math.round(row?.older_avg ?? 0)
  const newerAvg = Math.round(row?.newer_avg ?? 0)
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

export async function getScoreDistributionForColumn(
  tableName: QueryableTable,
  columnName: NumericColumn,
  rangeStartDate?: Date,
): Promise<BarDataSet[]> {
  const table = getIdentifier(tableName)
  const column = getIdentifier(columnName)
  const where = getCreatedAtWhereClause(rangeStartDate)

  const rows = await prisma.$queryRaw<DistributionRow[]>(Prisma.sql`
    SELECT
      ${column}::text AS score,
      COUNT(*) AS count
    FROM ${table}
    ${where}
    GROUP BY ${column}
    ORDER BY ${column} ASC
  `)

  if (rows.length === 0) {
    return []
  }

  return [
    {
      label: 'Score Distribution',
      data: Object.fromEntries(
        rows.map((row) => [row.score, Number(row.count)]),
      ),
      sort: sortEntriesByNumericValue,
    },
  ]
}

export async function getScoreAverageByDateForColumn(
  tableName: QueryableTable,
  columnName: NumericColumn,
  rangeStartDate?: Date,
): Promise<LineDataSet[]> {
  const table = getIdentifier(tableName)
  const column = getIdentifier(columnName)
  const where = getCreatedAtWhereClause(rangeStartDate)
  const dayBucket = Prisma.sql`DATE_TRUNC('day', "createdAt")`

  const rows = await prisma.$queryRaw<AverageByDateRow[]>(Prisma.sql`
    SELECT
      TO_CHAR(${dayBucket}, 'DD/MM/YY') AS label,
      AVG(${column}) AS average
    FROM ${table}
    ${where}
    GROUP BY ${dayBucket}
    ORDER BY ${dayBucket} ASC
  `)

  if (rows.length === 0) {
    return []
  }

  return [
    {
      label: 'Score Trend',
      data: Object.fromEntries(
        rows.map((row) => [row.label, Math.round(row.average ?? 0)]),
      ),
    },
  ]
}

function getCreatedAtWhereClause(rangeStartDate?: Date) {
  return rangeStartDate
    ? Prisma.sql`WHERE "createdAt" >= ${rangeStartDate}`
    : Prisma.empty
}

function getIdentifier(identifier: string) {
  return Prisma.raw(`"${identifier}"`)
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
