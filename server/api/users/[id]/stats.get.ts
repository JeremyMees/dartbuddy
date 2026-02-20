import { z } from 'zod'

const querySchema = z.object({
  days: z.coerce.number().optional(),
  months: z.coerce.number().optional(),
})

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')

  if (!id) {
    throw createError({
      statusCode: 400,
      statusMessage: 'User ID is required',
    })
  }

  const { success, data, error } = await getValidatedQuery(event, (queries) =>
    querySchema.safeParse(queries),
  )

  if (!success) throw error.issues

  let dateFilter: Date | undefined
  if (data.days) {
    dateFilter = new Date()
    dateFilter.setDate(dateFilter.getDate() - data.days)
  } else if (data.months) {
    dateFilter = new Date()
    dateFilter.setMonth(dateFilter.getMonth() - data.months)
  }

  const dateCondition = dateFilter ? { gte: dateFilter } : undefined

  const user = await prisma.user.findUnique({
    where: { id },
  })

  if (!user) {
    throw createError({
      statusCode: 404,
      statusMessage: 'User not found',
    })
  }

  const [
    gamesPlayed,
    gamesWon,
    legsWon,
    setsWon,
    turnStats,
    oneEighties,
    tonPlus,
    throwStats,
    checkouts,
    recentScores,
  ] = await Promise.all([
    prisma.gamePlayer.count({
      where: {
        playerId: id,
        game: dateCondition ? { createdAt: dateCondition } : undefined,
      },
    }),

    prisma.game.count({
      where: {
        winnerId: id,
        ...(dateCondition && { createdAt: dateCondition }),
      },
    }),

    prisma.leg.count({
      where: {
        winnerId: id,
        ...(dateCondition && { createdAt: dateCondition }),
      },
    }),

    prisma.set.count({
      where: {
        winnerId: id,
        ...(dateCondition && { createdAt: dateCondition }),
      },
    }),

    prisma.turn.aggregate({
      where: {
        playerId: id,
        ...(dateCondition && { startedAt: dateCondition }),
      },
      _avg: {
        totalScored: true,
      },
      _count: true,
      _sum: {
        totalScored: true,
      },
    }),

    prisma.turn.count({
      where: {
        playerId: id,
        totalScored: 180,
        ...(dateCondition && { startedAt: dateCondition }),
      },
    }),

    prisma.turn.count({
      where: {
        playerId: id,
        totalScored: { gte: 100 },
        ...(dateCondition && { startedAt: dateCondition }),
      },
    }),

    prisma.throw.aggregate({
      where: {
        playerId: id,
        ...(dateCondition && { turn: { startedAt: dateCondition } }),
      },
      _avg: {
        scored: true,
      },
      _count: true,
    }),

    prisma.leg.findMany({
      where: {
        winnerId: id,
        ...(dateCondition && { createdAt: dateCondition }),
      },
      select: {
        turns: {
          where: { playerId: id },
          orderBy: { startedAt: 'desc' },
          take: 1,
          select: {
            remainingScore: true,
            startingScore: true,
            totalScored: true,
            throws: {
              orderBy: { order: 'desc' },
              take: 1,
              select: { segment: true, scored: true },
            },
          },
        },
      },
    }),

    prisma.turn.findMany({
      where: {
        playerId: id,
        ...(dateCondition && { startedAt: dateCondition }),
      },
      orderBy: { startedAt: 'desc' },
      take: 50,
      select: {
        totalScored: true,
        startedAt: true,
        isBust: true,
      },
    }),
  ])

  const checkoutScores = checkouts
    .map((leg) => leg.turns[0]?.totalScored)
    .filter((score): score is number => score !== undefined && score > 0)

  const highestCheckout =
    checkoutScores.length > 0 ? Math.max(...checkoutScores) : 0
  const avgCheckout =
    checkoutScores.length > 0
      ? checkoutScores.reduce((a, b) => a + b, 0) / checkoutScores.length
      : 0

  const checkoutAttempts = await prisma.turn.count({
    where: {
      playerId: id,
      startingScore: { lte: 170 },
      ...(dateCondition && { startedAt: dateCondition }),
    },
  })

  const scoreDistribution = {
    '0-20': 0,
    '21-40': 0,
    '41-60': 0,
    '61-80': 0,
    '81-100': 0,
    '101-140': 0,
    '141-180': 0,
  }

  recentScores.forEach(({ totalScored }) => {
    if (totalScored <= 20) scoreDistribution['0-20']++
    else if (totalScored <= 40) scoreDistribution['21-40']++
    else if (totalScored <= 60) scoreDistribution['41-60']++
    else if (totalScored <= 80) scoreDistribution['61-80']++
    else if (totalScored <= 100) scoreDistribution['81-100']++
    else if (totalScored <= 140) scoreDistribution['101-140']++
    else scoreDistribution['141-180']++
  })

  return {
    user,
    dateRange: {
      days: data.days,
      months: data.months,
      from: dateFilter?.toISOString() ?? null,
    },
    overview: {
      gamesPlayed,
      gamesWon,
      gamesLost: gamesPlayed - gamesWon,
      winRate: gamesPlayed > 0 ? (gamesWon / gamesPlayed) * 100 : 0,
      legsWon,
      setsWon,
    },
    scoring: {
      totalTurns: turnStats._count,
      totalPoints: turnStats._sum.totalScored ?? 0,
      averageScore: turnStats._avg.totalScored ?? 0,
      averagePerDart: throwStats._avg.scored ?? 0,
      totalThrows: throwStats._count,
      oneEighties,
      tonPlus,
    },
    checkouts: {
      highest: highestCheckout,
      average: avgCheckout,
      attempts: checkoutAttempts,
      total: legsWon,
    },
    charts: {
      recentScores: recentScores.reverse().map((t) => ({
        score: t.totalScored,
        date: t.startedAt,
        isBust: t.isBust,
      })),
      scoreDistribution,
    },
  }
})
