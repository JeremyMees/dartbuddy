import { mountSuspended } from '@nuxt/test-utils/runtime'
import { describe, expect, it } from 'vitest'
import { playerTwo } from '~~/test/fixtures'
import PlayerStatsCard from '~/components/player-stats-card.vue'

const props = {
  average: 99,
  busts: 0,
  checkoutAttempts: 2,
  checkoutSuccesses: 2,
  highestCheckout: 170,
  highestTurn: 180,
  legs: 0,
  oneEighties: 3,
  points: 429,
  sets: 0,
  thrown: 6,
  totalLegsWon: 1,
  firstName: playerTwo.firstName,
  lastName: playerTwo.lastName,
  nickName: playerTwo.nickName,
  playerId: playerTwo.id,
}

describe('PlayerStatsCard', () => {
  it('should render correctly with default props', async () => {
    const component = await mountSuspended(PlayerStatsCard, { props })

    expect(component.html()).toMatchSnapshot()
  })

  it('should show the name correctly', async () => {
    const component = await mountSuspended(PlayerStatsCard, { props })
    const name = component.find('[data-test-name]')

    expect(name.text()).toBe(
      `${props.firstName} "${props.nickName}" ${props.lastName}`,
    )
  })

  it('should show the points correctly', async () => {
    const component = await mountSuspended(PlayerStatsCard, { props })
    const points = component.find('[data-test-points]')

    expect(points.text()).toBe(`${props.points} Score`)
  })
})
