export type GameRange =
  | 'allTime'
  | 'lastYear'
  | 'lastMonth'
  | 'lastWeek'
  | 'today'

export type GameType =
  | 'aroundTheClock'
  | 'singlesTraining'
  | 'doublesTraining'
  | 'scoreTraining'
  | 'matchGame'

export interface GameData<T> {
  range: GameRange
  games: T[]
}
