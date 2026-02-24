import { describe, expect, it } from 'vitest'
import { calculatePlayerStats } from '~/utils/player-utils'
import { gameFull, playerTwo } from '~~/test/fixtures'

const player = gameFull.players[0]!

describe('calculatePlayerStats', () => {
  it('returns the correct player stats', () => {
    const stats = calculatePlayerStats(gameFull, player)

    expect(stats.average).toBe(99)
    expect(stats.busts).toBe(0)
    expect(stats.checkoutAttempts).toBe(2)
    expect(stats.checkoutSuccesses).toBe(2)
    expect(stats.highestCheckout).toBe(170)
    expect(stats.highestTurn).toBe(180)
    expect(stats.legs).toBe(0)
    expect(stats.oneEighties).toBe(3)
    expect(stats.points).toBe(429)
    expect(stats.sets).toBe(0)
    expect(stats.thrown).toBe(6)
    expect(stats.totalLegsWon).toBe(1)
    expect(stats.firstName).toBe(playerTwo.firstName)
    expect(stats.lastName).toBe(playerTwo.lastName)
    expect(stats.nickName).toBe(playerTwo.nickName)
    expect(stats.playerId).toBe(playerTwo.id)
  })

  it('returns the default stats for a non-existent player', () => {
    const stats = calculatePlayerStats(gameFull, {
      ...player,
      playerId: 'nonExistentPlayerId',
    })

    expect(stats.average).toBe(0)
    expect(stats.busts).toBe(0)
    expect(stats.checkoutAttempts).toBe(0)
    expect(stats.checkoutSuccesses).toBe(0)
    expect(stats.highestCheckout).toBe(0)
    expect(stats.highestTurn).toBe(0)
    expect(stats.legs).toBe(0)
    expect(stats.oneEighties).toBe(0)
    expect(stats.points).toBe(501)
    expect(stats.sets).toBe(0)
    expect(stats.thrown).toBe(0)
    expect(stats.totalLegsWon).toBe(0)
    expect(stats.firstName).toBe(playerTwo.firstName)
    expect(stats.lastName).toBe(playerTwo.lastName)
    expect(stats.nickName).toBe(playerTwo.nickName)
    expect(stats.playerId).toBe('nonExistentPlayerId')
  })
})
