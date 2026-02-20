import type { User } from './prisma'

export interface PlayerStats {
  playerId: string
  firstName: string
  lastName: string
  nickName: string
  sets: number
  legs: number
  totalLegsWon: number
  points: number
  thrown: number
  average: number
  highestTurn: number
  oneEighties: number
  highestCheckout: number
  checkoutAttempts: number
  checkoutSuccesses: number
  busts: number
}

export interface FullPlayerStats {
  user: User
  dateRange: {
    days?: number
    months?: number
    from: string | null
  }
  overview: {
    gamesPlayed: number
    gamesWon: number
    gamesLost: number
    winRate: number
    legsWon: number
    setsWon: number
  }
  scoring: {
    totalTurns: number
    totalPoints: number
    averageScore: number
    averagePerDart: number
    totalThrows: number
    oneEighties: number
    tonPlus: number
  }
  checkouts: {
    highest: number
    average: number
    attempts: number
    total: number
  }
  charts: {
    recentScores: {
      score: number
      date: string
      isBust: boolean
    }[]
    scoreDistribution: Record<string, number>
  }
}
