export type GameRange = 'allTime' | 'lastMonth' | 'lastWeek' | 'today'

export type GameType =
  | 'aroundTheClock'
  | 'singlesTraining'
  | 'doublesTraining'
  | 'scoreTraining'

export interface GameData<T> {
  range: GameRange
  games: T[]
}
