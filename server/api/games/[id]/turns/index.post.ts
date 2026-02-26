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

  const diff = await prisma.$transaction(async (tx) => {
    const createdTurn = await tx.turn.create({
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
      select: { id: true },
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

    const createdLeg = newLeg
      ? await tx.leg.create({
          data: {
            setId: newLeg.setId,
            number: newLeg.number,
          },
          select: { id: true },
        })
      : null

    const createdSet = newSet
      ? await tx.set.create({
          data: {
            gameId,
            number: newSet.number,
            legs: {
              create: {
                number: 1,
              },
            },
          },
          include: { legs: { select: { id: true } } },
        })
      : null

    if (gameUpdate) {
      const patch: Record<string, unknown> = {
        ...(gameUpdate.activePlayerId !== undefined && {
          activePlayerId: gameUpdate.activePlayerId,
        }),
        ...(gameUpdate.startPlayerId !== undefined && {
          startPlayerId: gameUpdate.startPlayerId,
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

    return {
      turnId: createdTurn.id,
      ...(createdLeg && { newLegId: createdLeg.id }),
      ...(createdSet && {
        newSetId: createdSet.id,
        newSetLegId: createdSet.legs[0]!.id,
      }),
    }
  })

  return diff
})
