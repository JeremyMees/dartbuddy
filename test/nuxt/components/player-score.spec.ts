import { mountSuspended } from '@nuxt/test-utils/runtime'
import { describe, expect, it } from 'vitest'
import PlayerScore from '~/components/player-score.vue'

const props = {
  points: 429,
  outType: 'DOUBLE' as const,
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

  it('should show bust when points are 1 and outType is MASTER', async () => {
    const component = await mountSuspended(PlayerScore, {
      props: {
        ...props,
        points: 1,
        outType: 'MASTER' as const,
      },
    })

    expect(component.text()).toBe('Bust')
  })

  it('should show bust when points are 1 and outType is DOUBLE', async () => {
    const component = await mountSuspended(PlayerScore, {
      props: {
        ...props,
        points: 1,
      },
    })

    expect(component.text()).toBe('Bust')
  })

  it('should not show bust when points are 1 and outType is STRAIGHT', async () => {
    const component = await mountSuspended(PlayerScore, {
      props: {
        ...props,
        points: 1,
        outType: 'STRAIGHT' as const,
      },
    })

    expect(component.text()).not.toBe('Bust')
  })

  it('should show bust when points are 0 and outType is STRAIGHT', async () => {
    const component = await mountSuspended(PlayerScore, {
      props: {
        ...props,
        points: 0,
        outType: 'STRAIGHT' as const,
      },
    })

    expect(component.text()).toBe('Bust')
  })
})
