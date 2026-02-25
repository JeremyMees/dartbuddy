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
