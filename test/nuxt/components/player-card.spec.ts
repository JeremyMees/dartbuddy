import { mountSuspended } from '@nuxt/test-utils/runtime'
import { describe, expect, it } from 'vitest'
import { playerTwo } from '~~/test/fixtures'
import PlayerCard from '~/components/player-card.vue'

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
  active: false,
  livePoints: null,
}

describe('PlayerCard', () => {
  it('should render correctly with default props', async () => {
    const component = await mountSuspended(PlayerCard, { props })

    expect(component.html()).toMatchSnapshot()
  })

  it('should show the active state correctly', async () => {
    const component = await mountSuspended(PlayerCard, {
      props: { ...props, active: true },
    })

    expect(component.attributes('class')).toContain(
      'bg-primary text-primary-foreground border-transparent',
    )
    expect(component.attributes('class')).not.toContain(
      'bg-transparent text-foreground',
    )

    const separator = component.find('[data-test-separator]')

    expect(separator.attributes('class')).toContain('bg-primary-foreground/50')
    expect(separator.attributes('class')).not.toContain('bg-border')
  })

  it('should show the name correctly', async () => {
    const component = await mountSuspended(PlayerCard, { props })
    const name = component.find('[data-test-name]')

    expect(name.text()).toBe(
      `${props.firstName} "${props.nickName}" ${props.lastName}`,
    )
  })

  it('should show the points correctly', async () => {
    const component = await mountSuspended(PlayerCard, { props })
    const points = component.find('[data-test-points]')

    expect(points.text()).toBe(`${props.points} Score`)
  })

  it('should show the live points over the points when livePoints is not null', async () => {
    const component = await mountSuspended(PlayerCard, {
      props: { ...props, livePoints: 400 },
    })
    const points = component.find('[data-test-points]')

    expect(points.text()).toBe('400 Score')
  })

  it('should show no throws when points are less than 2', async () => {
    const component = await mountSuspended(PlayerCard, {
      props: { ...props, points: 1 },
    })
    const points = component.findAll('[data-test-best-throw]')

    expect(points.length).toBe(0)
  })

  it('should show three T20s when checkout is above 170', async () => {
    const component = await mountSuspended(PlayerCard, { props })
    const points = component.findAll('[data-test-best-throw]')

    expect(points.map((p) => p.text())).toEqual(['T20', 'T20', 'T20'])
  })

  it('should show the correct amount of best throws when checkout is possible', async () => {
    const component = await mountSuspended(PlayerCard, {
      props: { ...props, points: 2 },
    })
    const points = component.findAll('[data-test-best-throw]')

    expect(points.map((p) => p.text())).toEqual(['D1'])
  })
})
