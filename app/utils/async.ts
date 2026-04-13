export function delayedFunction<TArgs extends unknown[], TResult>(
  fn: (...args: TArgs) => TResult | PromiseLike<TResult>,
  ms: number,
): (...args: TArgs) => Promise<TResult> {
  return async (...args: TArgs) => {
    const startTime = Date.now()

    const result = await fn(...args)
    const elapsedTime = Date.now() - startTime
    const remainingTime = Math.max(0, ms - elapsedTime)

    if (remainingTime > 0) {
      await new Promise((resolve) => setTimeout(resolve, remainingTime))
    }

    return result
  }
}
