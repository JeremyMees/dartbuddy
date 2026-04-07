import { mountSuspended } from '@nuxt/test-utils/runtime'
import { describe, expect, it } from 'vitest'
import ScoreTrainingDashboard from '~/components/score-training-dashboard.vue'

const createGame = (
  id: string,
  createdAt: string,
  score: number,
): Serialized<ScoreTrainingGame> => ({
  id,
  createdAt,
  updatedAt: createdAt,
  totalScore: score,
  highestScore: score,
  threeDartAverage: score / 3,
  oneEightyCount: score >= 180 ? 1 : 0,
  oneDartAverage: score / 10 / 3,
})

const props: GameData<Serialized<ScoreTrainingGame>> = {
  type: 'scoreTraining',
  range: 'allTime',
  games: [
    createGame('1', '2026-03-01T10:00:00', 40),
    createGame('2', '2026-03-02T10:00:00', 50),
    createGame('3', '2026-03-03T10:00:00', 60),
    createGame('4', '2026-03-04T10:00:00', 70),
    createGame('5', '2026-03-05T10:00:00', 200),
    createGame('6', '2026-03-06T10:00:00', 180),
  ],
}

describe('ScoreTrainingDashboard', () => {
  it('should render correctly with default props', async () => {
    const component = await mountSuspended(ScoreTrainingDashboard, { props })

    expect(component.html()).toMatchSnapshot()
  })

  it('should show empty state when no games are provided', async () => {
    const component = await mountSuspended(ScoreTrainingDashboard, {
      props: { ...props, games: [] },
    })

    expect(component.text()).toContain(
      'No games played yet. Start a game to see your stats here!',
    )
    expect(component.find('[data-test-total-score]').text()).toContain('N/A')
  })

  it('should show avg score stat', async () => {
    const component = await mountSuspended(ScoreTrainingDashboard, { props })
    const avgScoreCard = component.find('[data-test-avg-score]')

    expect(avgScoreCard.text()).toContain('Avg Score')
    expect(avgScoreCard.text()).toContain('100')
  })

  it('should show best game stat', async () => {
    const component = await mountSuspended(ScoreTrainingDashboard, { props })
    const bestGameCard = component.find('[data-test-total-score]')

    expect(bestGameCard.text()).toContain('Best Game')
    expect(bestGameCard.text()).toContain('200')
  })

  it('should show best three dart average stat', async () => {
    const component = await mountSuspended(ScoreTrainingDashboard, { props })
    const bestThreeDartCard = component.find('[data-test-best-three-dart-avg]')

    expect(bestThreeDartCard.text()).toContain('Best 3-Dart Avg')
    expect(bestThreeDartCard.text()).toContain('66.666')
  })

  it('should show total 180s stat', async () => {
    const component = await mountSuspended(ScoreTrainingDashboard, { props })
    const total180sCard = component.find('[data-test-total-180s]')

    expect(total180sCard.text()).toContain('Total 180S')
    expect(total180sCard.text()).toContain('2')
  })

  it('should show average highest throw stat', async () => {
    const component = await mountSuspended(ScoreTrainingDashboard, { props })
    const avgHighestThrowCard = component.find('[data-test-avg-highest-throw]')

    expect(avgHighestThrowCard.text()).toContain('Avg Highest throw')
    expect(avgHighestThrowCard.text()).toContain('100')
  })

  it('should show the line chart', async () => {
    const component = await mountSuspended(ScoreTrainingDashboard, { props })
    const lineChart = component.find('[data-test-line-chart]')

    expect(lineChart.exists()).toBeTruthy()
  })

  it('should show only the five most recent games', async () => {
    const component = await mountSuspended(ScoreTrainingDashboard, { props })
    const gameRows = component.findAll('tbody tr')

    expect(gameRows).toHaveLength(5)
    expect(gameRows[0]?.text()).toContain('180')
    expect(gameRows[4]?.text()).toContain('50')
  })

  it('should render the recent games table with score columns', async () => {
    const component = await mountSuspended(ScoreTrainingDashboard, { props })
    const table = component.find('table')
    const headers = table.findAll('th')

    expect(headers.map((h) => h.text())).toContain('Date')
    expect(headers.map((h) => h.text())).toContain('Total')
    expect(headers.map((h) => h.text())).toContain('Highest')
    expect(headers.map((h) => h.text())).toContain('3-Dart Avg')
    expect(headers.map((h) => h.text())).toContain('180S')

    const gameRows = table.find('tbody tr').findAll('td')

    expect(gameRows[0]!.text()).toContain('06 Mar, 10:00')
    expect(gameRows[1]!.text()).toContain('180')
    expect(gameRows[2]!.text()).toContain('180')
    expect(gameRows[3]!.text()).toContain('60')
    expect(gameRows[4]!.text()).toContain('1')
  })
})
