import { describe, expect, it } from 'vitest'
import { mergeTurnDiff } from '~/utils/game-update'
import { gameFull, playerOne } from '~~/test/fixtures'

const TEMP_TURN_ID = 'temp-99999'
const TEMP_LEG_ID = 'temp-leg-99999'
const TEMP_SET_ID = 'temp-set-99999'

const activeLegId = '0569a779-3e23-4553-8c5a-144ed8feaa16'
const activeSetId = '9dbd8b86-0fc1-4f37-864f-739502e81861'

function makeGameWithTempTurn(): GameFull {
  return {
    ...gameFull,
    sets: gameFull.sets.map((set) =>
      set.id === activeSetId
        ? {
            ...set,
            legs: set.legs.map((leg) =>
              leg.id === activeLegId
                ? {
                    ...leg,
                    turns: [
                      ...leg.turns,
                      {
                        id: TEMP_TURN_ID,
                        legId: activeLegId,
                        playerId: playerOne.id,
                        startedAt: new Date(),
                        startingScore: 310,
                        totalScored: 100,
                        remainingScore: 210,
                        isBust: false,
                        _count: { throws: 3 },
                      },
                    ],
                  }
                : leg,
            ),
          }
        : set,
    ),
  } as GameFull
}

function makeGameWithTempLeg(): GameFull {
  const tempLeg: GameFull['sets'][number]['legs'][number] = {
    id: TEMP_LEG_ID,
    setId: activeSetId,
    number: 99,
    createdAt: new Date(),
    endedAt: null,
    winnerId: null,
    turns: [],
  }

  return {
    ...gameFull,
    sets: gameFull.sets.map((set) =>
      set.id === activeSetId ? { ...set, legs: [...set.legs, tempLeg] } : set,
    ),
  } as GameFull
}

function makeGameWithTempSet(): GameFull {
  const tempSet: GameFull['sets'][number] = {
    id: TEMP_SET_ID,
    gameId: gameFull.id,
    number: gameFull.sets.length + 1,
    createdAt: new Date(),
    endedAt: null,
    winnerId: null,
    legs: [
      {
        id: TEMP_LEG_ID,
        setId: TEMP_SET_ID,
        number: 1,
        createdAt: new Date(),
        endedAt: null,
        winnerId: null,
        turns: [],
      },
    ],
  }

  return { ...gameFull, sets: [...gameFull.sets, tempSet] } as GameFull
}

describe('mergeTurnDiff', () => {
  it('should replace the temp turn ID with the real DB turn ID', () => {
    const game = makeGameWithTempTurn()
    const result = mergeTurnDiff(game, { turnId: 'real-turn-id' })
    const allTurns = result.sets.flatMap((s) => s.legs).flatMap((l) => l.turns)

    expect(allTurns.some((t) => t.id === 'real-turn-id')).toBe(true)
    expect(allTurns.some((t) => t.id === TEMP_TURN_ID)).toBe(false)
  })

  it('should preserve all other turn IDs unchanged', () => {
    const game = makeGameWithTempTurn()
    const originalRealTurns = game.sets
      .flatMap((s) => s.legs)
      .flatMap((l) => l.turns)
      .filter((t) => !t.id.startsWith('temp-'))
      .map((t) => t.id)
    const result = mergeTurnDiff(game, { turnId: 'real-turn-id' })
    const resultTurnIds = result.sets
      .flatMap((s) => s.legs)
      .flatMap((l) => l.turns)
      .map((t) => t.id)

    for (const id of originalRealTurns) {
      expect(resultTurnIds).toContain(id)
    }
  })

  it('should replace a temp-leg ID with the real DB leg ID when newLegId is provided', () => {
    const game = makeGameWithTempLeg()
    const result = mergeTurnDiff(game, {
      turnId: 'real-turn-id',
      newLegId: 'real-leg-id',
    })
    const allLegs = result.sets.flatMap((s) => s.legs)

    expect(allLegs.some((l) => l.id === 'real-leg-id')).toBe(true)
    expect(allLegs.some((l) => l.id === TEMP_LEG_ID)).toBe(false)
  })

  it('should not replace any leg IDs when newLegId is absent', () => {
    const game = makeGameWithTempLeg()
    const result = mergeTurnDiff(game, { turnId: 'real-turn-id' })
    const allLegs = result.sets.flatMap((s) => s.legs)

    expect(allLegs.some((l) => l.id === TEMP_LEG_ID)).toBe(true)
  })

  it('should replace a temp-set ID with the real DB set ID when newSetId is provided', () => {
    const game = makeGameWithTempSet()
    const result = mergeTurnDiff(game, {
      turnId: 'real-turn-id',
      newSetId: 'real-set-id',
      newSetLegId: 'real-leg-id',
    })

    expect(result.sets.some((s) => s.id === 'real-set-id')).toBe(true)
    expect(result.sets.some((s) => s.id === TEMP_SET_ID)).toBe(false)
  })

  it('should replace the temp leg inside the new set and update its setId', () => {
    const game = makeGameWithTempSet()
    const result = mergeTurnDiff(game, {
      turnId: 'real-turn-id',
      newSetId: 'real-set-id',
      newSetLegId: 'real-leg-id',
    })
    const newSet = result.sets.find((s) => s.id === 'real-set-id')

    expect(newSet?.legs[0]?.id).toBe('real-leg-id')
    expect(newSet?.legs[0]?.setId).toBe('real-set-id')
  })

  it('should not replace any set IDs when newSetId is absent', () => {
    const game = makeGameWithTempSet()
    const result = mergeTurnDiff(game, { turnId: 'real-turn-id' })

    expect(result.sets.some((s) => s.id === TEMP_SET_ID)).toBe(true)
  })

  it('should not mutate the original game', () => {
    const game = makeGameWithTempTurn()
    const snapshotSets = JSON.stringify(game.sets)

    mergeTurnDiff(game, { turnId: 'real-turn-id' })

    expect(JSON.stringify(game.sets)).toBe(snapshotSets)
  })
})
