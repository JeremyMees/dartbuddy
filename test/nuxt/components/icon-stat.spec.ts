import { mountSuspended } from '@nuxt/test-utils/runtime'
import { describe, expect, it } from 'vitest'
import IconStat from '~/components/icon-stat.vue'

const props = {
  icon: 'example-icon',
  value: 42,
  name: 'Example Stat',
}

describe('IconStat', () => {
  it('should render correctly with default props', async () => {
    const component = await mountSuspended(IconStat, { props })

    expect(component.html()).toMatchSnapshot()
  })

  it('should show the correct icon', async () => {
    const component = await mountSuspended(IconStat, { props })
    const icon = component.find('[data-test-icon]')

    expect(icon.attributes('class')).toContain(`i-${props.icon}`)
  })

  it('should show the correct value', async () => {
    const component = await mountSuspended(IconStat, { props })
    const value = component.find('[data-test-value]')

    expect(value.text()).toBe(String(props.value))
  })

  it('should show the correct name', async () => {
    const component = await mountSuspended(IconStat, { props })
    const name = component.find('[data-test-name]')

    expect(name.text()).toBe(props.name)
  })
})
