import { mountSuspended } from '@nuxt/test-utils/runtime'
import { describe, expect, it } from 'vitest'
import AroundTheClockDashboard from '~/components/around-the-clock-dashboard.vue'

const createGame = (
  id: string,
  createdAt: string,
  hitPercent: number,
  dartsThrown: number,
): Serialized<AroundTheClockGame> => ({
  id,
  createdAt,
  updatedAt: createdAt,
  hitPercent,
  dartsThrown,
})

const props: GameData<Serialized<AroundTheClockGame>> = {
  type: 'aroundTheClock',
  range: 'allTime',
  games: [
    createGame('1', '2026-03-01T10:00:00', 40, 90),
    createGame('2', '2026-03-02T10:00:00', 50, 80),
    createGame('3', '2026-03-03T10:00:00', 60, 70),
    createGame('4', '2026-03-04T10:00:00', 70, 60),
    createGame('5', '2026-03-05T10:00:00', 80, 50),
    createGame('6', '2026-03-06T10:00:00', 90, 40),
  ],
}

describe('AroundTheClockDashboard', () => {
  it('should render correctly with default props', async () => {
    const component = await mountSuspended(AroundTheClockDashboard, { props })

    expect(component.html()).toMatchSnapshot()
  })

  it('should show empty state when no games are provided', async () => {
    const component = await mountSuspended(AroundTheClockDashboard, {
      props: { ...props, games: [] },
    })

    expect(component.text()).toContain(
      'No games played yet. Start a game to see your stats here!',
    )
    expect(component.text()).toContain('Best Game')
    expect(component.text()).toContain('Last Game')
    expect(component.text()).toContain('0%')
  })

  it('should show the line chart', async () => {
    const component = await mountSuspended(AroundTheClockDashboard, { props })
    const lineChart = component.find('[data-test-line-chart]')

    expect(lineChart.exists()).toBeTruthy()
  })

  it('should show the bar chart', async () => {
    const component = await mountSuspended(AroundTheClockDashboard, { props })
    const barChart = component.find('[data-test-bar-chart]')

    expect(barChart.exists()).toBeTruthy()
  })

  it('should show computed stats', async () => {
    const component = await mountSuspended(AroundTheClockDashboard, { props })

    expect(component.text()).toContain('Avg Hit %')
    expect(component.text()).toContain('65%')
    expect(component.text()).toContain('Best Game')
    expect(component.text()).toContain('90%')
    expect(component.text()).toContain('Last Game')
    expect(component.text()).toContain('390')
    expect(component.text()).toContain('thrown overall')
  })

  it('should show only the five most recent games', async () => {
    const component = await mountSuspended(AroundTheClockDashboard, { props })
    const recentGames = component.findAll('li')

    expect(recentGames).toHaveLength(5)
    expect(recentGames[0]?.text()).toContain('90%')
    expect(recentGames[1]?.text()).toContain('80%')
    expect(recentGames[2]?.text()).toContain('70%')
    expect(recentGames[3]?.text()).toContain('60%')
    expect(recentGames[4]?.text()).toContain('50%')
  })
})
