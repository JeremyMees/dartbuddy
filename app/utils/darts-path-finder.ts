export interface DartThrow {
  segment: Segment
  score: number
}

export interface CheckoutTurn {
  darts: DartThrow[]
  remainingAfter: number
}

export interface CheckoutResult {
  turns: CheckoutTurn[]
  totalDarts: number
  finishingDouble: DartThrow
}

interface TurnInProgress {
  dartsThrown: DartThrow[]
  scoreLeft: number
}

interface BFSNode {
  remaining: number
  completedTurns: CheckoutTurn[]
}

const BOARD_NUMBERS = [
  1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 25,
] as const

function isFinishingDouble(dart: DartThrow): boolean {
  return dart.segment.startsWith('D')
}

export function isCheckoutPossible(score: number): boolean {
  return score >= 2 && score <= 501
}

function makeDartThrow(number: number, multiplier: number): DartThrow | null {
  const segment = calculateSegment(number, multiplier)
  if (segment === 'MISS') return null

  return {
    segment,
    score: calculateSegmentScore(segment),
  }
}

const throwsByScore: ReadonlyMap<number, DartThrow[]> = (() => {
  const map = new Map<number, DartThrow[]>()

  for (const number of BOARD_NUMBERS) {
    const maxMultiplier = number === 25 ? 2 : 3

    for (let multiplier = 1; multiplier <= maxMultiplier; multiplier++) {
      const dart = makeDartThrow(number, multiplier)
      if (!dart) continue

      const existing = map.get(dart.score) ?? []
      existing.push(dart)
      map.set(dart.score, existing)
    }
  }

  return map
})()

const ALL_DART_SCORES: readonly number[] = Array.from(
  throwsByScore.keys(),
).sort((a, b) => b - a)

function enumerateTurnSequences(
  tip: TurnInProgress,
  dartsLeft: number,
  onSequence: (tip: TurnInProgress, isWin: boolean) => void,
): void {
  const { scoreLeft, dartsThrown } = tip

  for (const score of ALL_DART_SCORES) {
    if (score > scoreLeft) continue

    const afterThrow = scoreLeft - score

    if (afterThrow === 1) continue

    const candidates = throwsByScore.get(score)!

    for (const dart of candidates) {
      const newTip: TurnInProgress = {
        dartsThrown: [...dartsThrown, dart],
        scoreLeft: afterThrow,
      }

      if (afterThrow === 0) {
        if (isFinishingDouble(dart)) onSequence(newTip, true)
        continue
      }

      if (dartsLeft - 1 === 0) {
        onSequence(newTip, false)
      } else {
        enumerateTurnSequences(newTip, dartsLeft - 1, onSequence)
      }
    }
  }
}

export function findCheckoutPath(startingScore: number): CheckoutResult | null {
  if (startingScore < 2 || startingScore > 501) {
    throw new RangeError(
      `Starting score must be between 2 and 501, got ${startingScore}`,
    )
  }

  const visited = new Set<number>([startingScore])
  const queue: BFSNode[] = [{ remaining: startingScore, completedTurns: [] }]

  while (queue.length > 0) {
    const { remaining, completedTurns } = queue.shift()!
    let found: CheckoutResult | null = null

    enumerateTurnSequences(
      { dartsThrown: [], scoreLeft: remaining },
      3,
      (tip, isWin) => {
        if (found) return

        const turn: CheckoutTurn = {
          darts: tip.dartsThrown,
          remainingAfter: tip.scoreLeft,
        }

        if (isWin) {
          const allTurns = [...completedTurns, turn]
          found = {
            turns: allTurns,
            totalDarts: allTurns.reduce((sum, t) => sum + t.darts.length, 0),
            finishingDouble: tip.dartsThrown.at(-1)!,
          }
          return
        }

        if (!visited.has(tip.scoreLeft)) {
          visited.add(tip.scoreLeft)
          queue.push({
            remaining: tip.scoreLeft,
            completedTurns: [...completedTurns, turn],
          })
        }
      },
    )

    if (found) return found
  }

  return null
}
