import { boardNumbers } from '~~/constants/board-numbers'

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

export function isCheckoutPossible(score: number): boolean {
  return score >= 2 && score <= 170
}

const ALL_DARTS: readonly DartThrow[] = (() => {
  const darts: DartThrow[] = []

  for (const number of boardNumbers) {
    const maxMultiplier = number === 25 ? 2 : 3

    for (let multiplier = 1; multiplier <= maxMultiplier; multiplier++) {
      const segment = calculateSegment(number, multiplier)
      if (segment === 'MISS') continue
      darts.push({ segment, score: calculateSegmentScore(segment) })
    }
  }

  darts.sort((a, b) => b.score - a.score)
  return darts
})()

const DOUBLES: readonly DartThrow[] = ALL_DARTS.filter((d) =>
  d.segment.startsWith('D'),
)

function buildOneDartFinishes(table: (DartThrow[] | null)[]): void {
  for (const d of DOUBLES) {
    if (d.score >= 2 && d.score <= 170) {
      table[d.score] = [d]
    }
  }
}

function buildTwoDartFinishes(table: (DartThrow[] | null)[]): void {
  for (const d1 of ALL_DARTS) {
    for (const d2 of DOUBLES) {
      const total = d1.score + d2.score
      if (total >= 2 && total <= 170 && !table[total]) {
        table[total] = [d1, d2]
      }
    }
  }
}

function buildThreeDartFinishes(table: (DartThrow[] | null)[]): void {
  for (const d1 of ALL_DARTS) {
    for (const d2 of ALL_DARTS) {
      const sum12 = d1.score + d2.score
      for (const d3 of DOUBLES) {
        const total = sum12 + d3.score
        if (total < 2 || total > 170 || table[total]) continue
        if (total - d1.score === 1) continue
        table[total] = [d1, d2, d3]
      }
    }
  }
}

const directFinish: ReadonlyArray<DartThrow[] | null> = (() => {
  const table: (DartThrow[] | null)[] = new Array(171).fill(null)
  buildOneDartFinishes(table)
  buildTwoDartFinishes(table)
  buildThreeDartFinishes(table)
  return table
})()

function makeResult(
  setupDarts: DartThrow[],
  remainingAfter: number,
  finish: DartThrow[],
): CheckoutResult {
  const turns: CheckoutTurn[] =
    setupDarts.length > 0
      ? [
          { darts: setupDarts, remainingAfter },
          { darts: finish, remainingAfter: 0 },
        ]
      : [{ darts: finish, remainingAfter: 0 }]

  return {
    turns,
    totalDarts: setupDarts.length + finish.length,
    finishingDouble: finish.at(-1)!,
  }
}

function findOneDartSetup(score: number): CheckoutResult | null {
  for (const d1 of ALL_DARTS) {
    const rem = score - d1.score
    if (rem < 2 || rem > 170) continue
    const fin = directFinish[rem]
    if (fin) return makeResult([d1], rem, fin)
  }
  return null
}

function findTwoDartSetup(score: number): CheckoutResult | null {
  let best: CheckoutResult | null = null

  for (const d1 of ALL_DARTS) {
    const after1 = score - d1.score
    if (after1 < 2) continue
    for (const d2 of ALL_DARTS) {
      const rem = after1 - d2.score
      if (rem < 2 || rem > 170) continue
      const fin = directFinish[rem]
      if (!fin) continue
      const total = 2 + fin.length
      if (!best || total < best.totalDarts) {
        best = makeResult([d1, d2], rem, fin)
      }
    }
  }

  return best
}

function tryThreeDartCombination(
  d1: DartThrow,
  d2: DartThrow,
  score: number,
  best: CheckoutResult | null,
): CheckoutResult | null {
  const after2 = score - d1.score - d2.score
  if (after2 < 2) return best

  for (const d3 of ALL_DARTS) {
    const rem = after2 - d3.score
    if (rem < 2 || rem > 170) continue
    const fin = directFinish[rem]
    if (!fin) continue
    const total = 3 + fin.length
    if (!best || total < best.totalDarts) {
      best = makeResult([d1, d2, d3], rem, fin)
    }
  }

  return best
}

function findThreeDartSetup(score: number): CheckoutResult | null {
  let best: CheckoutResult | null = null

  for (const d1 of ALL_DARTS) {
    if (score - d1.score < 2) continue
    for (const d2 of ALL_DARTS) {
      best = tryThreeDartCombination(d1, d2, score, best)
    }
  }

  return best
}

function findMultiTurnCheckout(score: number): CheckoutResult | null {
  const oneDart = findOneDartSetup(score)
  if (oneDart && oneDart.totalDarts <= 3) return oneDart

  const twoDart = findTwoDartSetup(score)
  const best2 = betterResult(oneDart, twoDart)
  if (best2 && best2.totalDarts <= 4) return best2

  const threeDart = findThreeDartSetup(score)
  return betterResult(best2, threeDart)
}

function betterResult(
  a: CheckoutResult | null,
  b: CheckoutResult | null,
): CheckoutResult | null {
  if (!a) return b
  if (!b) return a
  return b.totalDarts < a.totalDarts ? b : a
}

const checkoutTable: ReadonlyArray<CheckoutResult | null> = (() => {
  const table: (CheckoutResult | null)[] = new Array(171).fill(null)

  for (let score = 2; score <= 170; score++) {
    const finish = directFinish[score]

    if (finish) {
      table[score] = makeResult([], 0, finish)
      continue
    }

    table[score] = findMultiTurnCheckout(score)
  }

  return table
})()

export function findCheckoutPath(startingScore: number): CheckoutResult | null {
  if (startingScore < 2 || startingScore > 170) {
    throw new RangeError(
      `Starting score must be between 2 and 170, got ${startingScore}`,
    )
  }

  return checkoutTable[startingScore] ?? null
}
