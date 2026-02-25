import { checkoutTable, type CheckoutResult } from '~~/constants/checkout-table'

export function isCheckoutPossible(score: number): boolean {
  return score >= 2 && score <= 170
}

export function findCheckoutPath(startingScore: number): CheckoutResult | null {
  if (!isCheckoutPossible(startingScore)) {
    throw new RangeError(
      `Starting score must be between 2 and 170, got ${startingScore}`,
    )
  }

  return checkoutTable[startingScore] ?? null
}

export function isBust(
  outType: OutType,
  remaining: number,
  lastSegment: Segment | undefined,
): boolean {
  if (!outType || remaining < 0) return true

  if (remaining === 1 && outType !== 'STRAIGHT') return true

  if (remaining === 0 && lastSegment) {
    if (outType === 'DOUBLE') {
      return !lastSegment.startsWith('D')
    }
    if (outType === 'MASTER') {
      return !lastSegment.startsWith('D') && !lastSegment.startsWith('T')
    }
  }

  return false
}

export function calculateCurrentPoints(
  currentLegTurns: GameTurn[],
  fallback: number = 0,
): number {
  return currentLegTurns.at(-1)?.remainingScore ?? fallback
}
