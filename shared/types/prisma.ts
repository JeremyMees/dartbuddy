import type { Prisma } from '~~/server/generated/prisma/client'

export type {
  User,
  Game,
  GamePlayer,
  Set,
  Leg,
  Turn,
  Throw,
  OutType,
  GameEndReason,
} from '~~/server/generated/prisma/client'

export type CreateUser = Prisma.UserCreateInput
export type UpdateUser = Prisma.UserUpdateInput
export type CreateGame = Prisma.GameCreateInput
export type UpdateGame = Prisma.GameUpdateInput
export type CreateGamePlayer = Prisma.GamePlayerCreateInput
export type UpdateGamePlayer = Prisma.GamePlayerUpdateInput
export type CreateSet = Prisma.SetCreateInput
export type UpdateSet = Prisma.SetUpdateInput
export type CreateLeg = Prisma.LegCreateInput
export type UpdateLeg = Prisma.LegUpdateInput
export type CreateTurn = Prisma.TurnCreateInput
export type UpdateTurn = Prisma.TurnUpdateInput
export type CreateThrow = Prisma.ThrowCreateInput
export type UpdateThrow = Prisma.ThrowUpdateInput

export type GameWithPlayers = Prisma.GameGetPayload<{
  include: {
    players: {
      include: {
        player: true
      }
    }
    winner: true
  }
}>

export type GameOverview = Prisma.GameGetPayload<{
  include: {
    players: {
      include: {
        player: true
      }
    }
    sets: {
      include: {
        winner: true
        legs: {
          include: {
            winner: true
          }
        }
      }
    }
    winner: true
  }
}>

export type GameFull = Prisma.GameGetPayload<{
  include: {
    players: {
      include: {
        player: true
      }
    }
    sets: {
      include: {
        winner: true
        legs: {
          include: {
            winner: true
            turns: {
              include: {
                throws: true
                player: true
              }
            }
          }
        }
      }
    }
    winner: true
  }
}>

export type LegWithTurns = Prisma.LegGetPayload<{
  include: {
    turns: {
      include: {
        throws: true
        player: true
      }
    }
    winner: true
  }
}>

export type TurnWithThrows = Prisma.TurnGetPayload<{
  include: {
    throws: true
    player: true
  }
}>

export type UserWithGames = Prisma.UserGetPayload<{
  include: {
    gamePlayers: {
      include: {
        game: true
      }
    }
    wonGames: true
    wonSets: true
    wonLegs: true
  }
}>

export type SetWithLegs = Prisma.SetGetPayload<{
  include: {
    legs: {
      include: {
        winner: true
      }
    }
    winner: true
  }
}>

export type SetFull = Prisma.SetGetPayload<{
  include: {
    legs: {
      include: {
        winner: true
        turns: {
          include: {
            throws: true
            player: true
          }
        }
      }
    }
    winner: true
  }
}>

export type GamePlayerWithUser = Prisma.GamePlayerGetPayload<{
  include: {
    player: true
  }
}>

export interface PaginationData {
  page: number
  amount: number
  total: number
  totalPages: number
}
