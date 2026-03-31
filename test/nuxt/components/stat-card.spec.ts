import { mountSuspended } from '@nuxt/test-utils/runtime'
import { describe, expect, it } from 'vitest'
import StatCard from '~/components/stat-card.vue'

const props = {
  label: 'Example Stat',
  stat: 42,
}

describe('StatCard', () => {
  it('should render correctly with default props', async () => {
    const component = await mountSuspended(StatCard, { props })

    expect(component.html()).toMatchSnapshot()
  })

  it('should show the label', async () => {
    const component = await mountSuspended(StatCard, { props })
    const label = component.find('[data-test-label]')

    expect(label.text()).toBe(props.label)
  })

  it('should show the stat from props', async () => {
    const component = await mountSuspended(StatCard, { props })
    const stat = component.find('[data-test-stat]')

    expect(stat.text()).toBe(String(props.stat))
  })

  it('should show the stat from default slot', async () => {
    const component = await mountSuspended(StatCard, {
      props: { label: props.label },
      slots: { default: () => props.stat },
    })
    const stat = component.find('[data-test-stat]')

    expect(stat.text()).toBe(String(props.stat))
  })

  it('should not show the card footer if no footer slot is provided', async () => {
    const component = await mountSuspended(StatCard, { props })
    const footer = component.find('[data-test-footer]')

    expect(footer.exists()).toBeFalsy()
  })

  it('should show the content from footer slot', async () => {
    const component = await mountSuspended(StatCard, {
      props,
      slots: { default: () => props.stat, footer: () => 'Footer Content' },
    })
    const footer = component.find('[data-test-footer]')

    expect(footer.text()).toBe('Footer Content')
  })

  it('should be possible to provide custom classes', async () => {
    const component = await mountSuspended(StatCard, {
      props: { ...props, class: 'custom-class' },
    })
    const card = component.find('.custom-class')

    expect(card.exists()).toBeTruthy()
  })
})
