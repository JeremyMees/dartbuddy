import { mountSuspended } from '@nuxt/test-utils/runtime'
import { describe, expect, it } from 'vitest'
import GameControls from '~/components/game-controls.vue'

const props = {
  scoreLimit: 501,
  outType: 'DOUBLE' as const,
  setsToWin: 2,
  legsToWin: 3,
  currentLeg: null,
  isMatchOver: false,
}

describe('GameControls', () => {
  it('should render correctly with default props', async () => {
    const component = await mountSuspended(GameControls, { props })

    expect(component.html()).toMatchSnapshot()
  })

  it('should show the correct score', async () => {
    const component = await mountSuspended(GameControls, { props })
    const scoreInfo = component.find('[data-test-score]')

    expect(scoreInfo.text()).toContain(props.scoreLimit)
  })

  it('should show the correct out type', async () => {
    const componentSingle = await mountSuspended(GameControls, {
      props: { ...props, outType: 'STRAIGHT' },
    })
    const scoreInfoSingle = componentSingle.find('[data-test-score]')

    expect(scoreInfoSingle.text()).toContain('Single Out')

    const componentDouble = await mountSuspended(GameControls, {
      props: { ...props, outType: 'DOUBLE' },
    })
    const scoreInfoDouble = componentDouble.find('[data-test-score]')

    expect(scoreInfoDouble.text()).toContain('Double Out')

    const componentMaster = await mountSuspended(GameControls, {
      props: { ...props, outType: 'MASTER' },
    })
    const scoreInfoMaster = componentMaster.find('[data-test-score]')

    expect(scoreInfoMaster.text()).toContain('Master Out')
  })
})
