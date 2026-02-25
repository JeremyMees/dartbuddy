import { turnActionSchema } from '#shared/form-schemas/turn'

export default defineEventHandler(async (event) => {
  const { success, data, error } = await readValidatedBody(event, (body) =>
    turnActionSchema.safeParse(body),
  )

  if (!success) throw error.issues

  const gameId = getRouterParam(event, 'id')

  if (!gameId) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Game ID is required',
    })
  }

  const {
    legId,
    playerId,
    throws,
    startingScore,
    isBust,
    legUpdate,
    setUpdate,
    newLeg,
    newSet,
    gameUpdate,
  } = data

  const totalScored = throws.reduce((sum, t) => sum + t.scored, 0)
  const remainingScore = isBust ? startingScore : startingScore - totalScored

  const game = await prisma.$transaction(async (tx) => {
    await tx.turn.create({
      data: {
        legId,
        playerId,
        startingScore,
        totalScored,
        remainingScore,
        isBust,
        throws: {
          create: throws.map((t, i) => ({
            playerId,
            order: i + 1,
            segment: t.segment,
            scored: t.scored,
          })),
        },
      },
    })

    if (legUpdate) {
      await tx.leg.update({
        where: {
          id: legUpdate.legId,
        },
        data: {
          winnerId: legUpdate.winnerId,
          endedAt: legUpdate.endedAt,
        },
      })
    }

    if (setUpdate) {
      await tx.set.update({
        where: {
          id: setUpdate.setId,
        },
        data: {
          winnerId: setUpdate.winnerId,
          endedAt: setUpdate.endedAt,
        },
      })
    }

    if (newLeg) {
      await tx.leg.create({
        data: {
          setId: newLeg.setId,
          number: newLeg.number,
        },
      })
    }

    if (newSet) {
      await tx.set.create({
        data: {
          gameId,
          number: newSet.number,
          legs: {
            create: {
              number: 1,
            },
          },
        },
      })
    }

    if (gameUpdate) {
      const patch: Record<string, unknown> = {
        ...(gameUpdate.activePlayerId !== undefined && {
          activePlayerId: gameUpdate.activePlayerId,
        }),
        ...(gameUpdate.winnerId !== undefined && {
          winnerId: gameUpdate.winnerId,
        }),
        ...(gameUpdate.completedAt !== undefined && {
          completedAt: gameUpdate.completedAt,
        }),
        ...(gameUpdate.endReason !== undefined && {
          endReason: gameUpdate.endReason,
        }),
      }

      if (Object.keys(patch).length > 0) {
        await tx.game.update({
          where: {
            id: gameId,
          },
          data: patch,
        })
      }
    }

    return tx.game.findUniqueOrThrow({
      where: {
        id: gameId,
      },
      include: gameFullInclude,
    })
  })

  return game
})
