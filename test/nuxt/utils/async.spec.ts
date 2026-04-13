import { afterEach, describe, expect, it, vi } from 'vitest'

describe('Async utils', () => {
  afterEach(() => {
    vi.useRealTimers()
  })

  describe('delayedFunction', () => {
    it('should return the original function result', async () => {
      vi.useFakeTimers()

      const callback = vi.fn(async (value: number) => value * 2)
      const delayedCallback = delayedFunction(callback, 100)

      const promise = delayedCallback(10)

      await vi.runAllTimersAsync()

      await expect(promise).resolves.toBe(20)
      expect(callback).toHaveBeenCalledTimes(1)
      expect(callback).toHaveBeenCalledWith(10)
    })

    it('should wait for the remaining time when callback resolves too quickly', async () => {
      vi.useFakeTimers()

      const callback = vi.fn(async () => {
        await new Promise((resolve) => setTimeout(resolve, 20))
        return 'done'
      })
      const delayedCallback = delayedFunction(callback, 100)

      let isResolved = false
      const promise = delayedCallback().then(() => {
        isResolved = true
      })

      await vi.advanceTimersByTimeAsync(99)

      expect(isResolved).toBeFalsy()

      await vi.advanceTimersByTimeAsync(1)
      await promise

      expect(isResolved).toBeTruthy()
    })

    it('should not add extra delay when callback already takes longer than the minimum', async () => {
      vi.useFakeTimers()

      const callback = vi.fn(async () => {
        await new Promise((resolve) => setTimeout(resolve, 120))
        return 'done'
      })
      const delayedCallback = delayedFunction(callback, 100)

      let isResolved = false
      const promise = delayedCallback().then(() => {
        isResolved = true
      })

      await vi.advanceTimersByTimeAsync(119)

      expect(isResolved).toBeFalsy()

      await vi.advanceTimersByTimeAsync(1)
      await promise

      expect(isResolved).toBeTruthy()
    })
  })
})
