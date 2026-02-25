import { mountSuspended } from '@nuxt/test-utils/runtime'
import { describe, expect, it } from 'vitest'
import SingleStat from '~/components/single-stat.vue'

const props = {
  value: 42,
  name: 'Example Stat',
}

describe('SingleStat', () => {
  it('should render correctly with default props', async () => {
    const component = await mountSuspended(SingleStat, { props })

    expect(component.html()).toMatchSnapshot()
  })

  it('should show the name', async () => {
    const component = await mountSuspended(SingleStat, { props })
    const name = component.find('[data-test-name]')

    expect(name.text()).toBe(props.name)
  })

  it('should show the value', async () => {
    const component = await mountSuspended(SingleStat, { props })
    const value = component.find('[data-test-value]')

    expect(value.text()).toBe(props.value.toString())
  })
})
