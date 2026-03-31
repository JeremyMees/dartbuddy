export type TrendDirection = 'up' | 'down' | 'normal'

export interface TrendResult {
  direction: TrendDirection
  change: number
}
