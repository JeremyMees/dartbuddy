import { PrismaClient } from '@@/server/generated/prisma/client.js'
import { PrismaPg } from '@prisma/adapter-pg'

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
})

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const prisma = globalForPrisma.prisma ?? new PrismaClient({ adapter })

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

export const gameFullInclude = {
  players: {
    orderBy: { seatOrder: 'asc' } as const,
    include: { player: true },
  },
  sets: {
    orderBy: { number: 'asc' } as const,
    include: {
      winner: true,
      legs: {
        orderBy: { number: 'asc' } as const,
        include: {
          winner: true,
          turns: {
            orderBy: { startedAt: 'asc' } as const,
            include: {
              throws: { orderBy: { order: 'asc' } as const },
              player: true,
            },
          },
        },
      },
    },
  },
  winner: true,
  activePlayer: true,
} as const
