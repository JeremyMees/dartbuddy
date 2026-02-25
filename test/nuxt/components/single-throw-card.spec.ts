import { mountSuspended } from '@nuxt/test-utils/runtime'
import { describe, expect, it } from 'vitest'
import SingleThrowCard from '~/components/single-throw-card.vue'

const props = {
  segment: 'T20' as const,
}

describe('SingleThrowCard', () => {
  it('should render correctly with default props', async () => {
    const component = await mountSuspended(SingleThrowCard, { props })

    expect(component.html()).toMatchSnapshot()
  })

  it('should show the thrown segment', async () => {
    const component = await mountSuspended(SingleThrowCard, { props })
    const segment = component.find('[data-test-segment]')

    expect(segment.text()).toBe(props.segment)
  })

  it('should show the button', async () => {
    const component = await mountSuspended(SingleThrowCard, { props })
    const button = component.find('[data-test-remove]')

    expect(button.exists()).toBeTruthy()
  })

  it('should emit remove when clicking the button', async () => {
    const component = await mountSuspended(SingleThrowCard, { props })

    await component.find('[data-test-remove]').trigger('click')

    const emitted = component.emitted('remove')

    expect(emitted).toBeTruthy()
    expect(emitted?.length).toBe(1)
  })
})
