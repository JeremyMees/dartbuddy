import { mountSuspended } from '@nuxt/test-utils/runtime'
import { describe, expect, it } from 'vitest'
import IconCard from '~/components/icon-card.vue'

const props = {
  icon: 'example-icon',
}

describe('IconCard', () => {
  it('should render correctly with default props', async () => {
    const component = await mountSuspended(IconCard, { props })

    expect(component.html()).toMatchSnapshot()
  })

  it('should show the correct icon', async () => {
    const component = await mountSuspended(IconCard, { props })
    const icon = component.find('[data-test-icon]')

    expect(icon.attributes('class')).toContain(`i-${props.icon}`)
  })
})
