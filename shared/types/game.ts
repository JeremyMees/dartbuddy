import type {
  LineDataSet,
  PieDataSet,
  BarDataSet,
  MatchGame,
  SinglesTrainingGame,
  DoublesTrainingGame,
  ScoreTrainingGame,
  AroundTheClockGame,
  TrendResult,
} from '#shared/types'

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

export interface AverageScore {
  percent: number
  trend: TrendResult
}

export interface MatchGameDashboardData {
  totalGames: number
  winRate: number
  checkoutStats: {
    hits: number
    thrown: number
    percent: number
  }
  threeDartsAverage: number
  firstNineDartAverage: number
  highestFinish: number
  highestScore: number
  scoreTrend: LineDataSet[]
  winLossDistribution: PieDataSet[]
  recentGames: (MatchGame & { checkoutPercentage: number })[]
}

export interface AroundTheClockDashboardData {
  totalGames: number
  averageHitPercent: AverageScore
  dartsThrown: number
  bestGame: AroundTheClockGame | null
  lastGame: AroundTheClockGame | null
  scoreDistribution: BarDataSet[]
  scoreTrend: LineDataSet[]
  recentGames: AroundTheClockGame[]
}

export interface DoublesTrainingDashboardData {
  totalGames: number
  averageScore: AverageScore
  bestGame: DoublesTrainingGame | null
  scoreDistribution: BarDataSet[]
  scoreTrend: LineDataSet[]
  recentGames: DoublesTrainingGame[]
}

export interface ScoreTrainingDashboardData {
  totalGames: number
  averageScore: AverageScore
  bestGame: ScoreTrainingGame | null
  bestThreeDarts: number
  thrownOneEighties: number
  highestThrow: number
  averageHighestThrow: number
  scoreTrend: LineDataSet[]
  recentGames: ScoreTrainingGame[]
}

export interface SinglesTrainingDashboardData {
  totalGames: number
  averageScore: AverageScore
  bestGame: SinglesTrainingGame | null
  scoreDistribution: BarDataSet[]
  scoreTrend: LineDataSet[]
  recentGames: SinglesTrainingGame[]
}
