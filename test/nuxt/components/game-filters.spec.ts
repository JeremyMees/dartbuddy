import { mountSuspended } from '@nuxt/test-utils/runtime'
import { describe, expect, it } from 'vitest'
import GameFilters from '~/components/game-filters.vue'

const props = {
  label: 'Example Stat',
  stat: 42,
}

describe('GameFilters', () => {
  it('should render correctly with default props', async () => {
    const component = await mountSuspended(GameFilters, { props })

    expect(component.html()).toMatchSnapshot()
  })

  it('should show two select components', async () => {
    const component = await mountSuspended(GameFilters, { props })
    const selects = component.findAll('[data-slot="select-trigger"]')

    expect(selects.length).toBe(2)
  })
})
