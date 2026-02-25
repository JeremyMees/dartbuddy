import { mountSuspended } from '@nuxt/test-utils/runtime'
import { describe, expect, it } from 'vitest'
import PlayerScore from '~/components/player-score.vue'

const props = {
  points: 429,
}

describe('PlayerScore', () => {
  it('should render correctly with default props', async () => {
    const component = await mountSuspended(PlayerScore, { props })

    expect(component.html()).toMatchSnapshot()
  })

  it('should show the points correctly', async () => {
    const component = await mountSuspended(PlayerScore, { props })

    expect(component.text()).toBe(`${props.points} Score`)
  })
})
