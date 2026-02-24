import { mountSuspended } from '@nuxt/test-utils/runtime'
import { describe, expect, it } from 'vitest'
import AppNavigation from '~/components/app-navigation.vue'

describe('AppNavigation', () => {
  it('should render correctly with default props', async () => {
    const component = await mountSuspended(AppNavigation)

    expect(component.html()).toMatchSnapshot()
  })

  it('should render all links', async () => {
    const component = await mountSuspended(AppNavigation)
    const links = component.findAll('[data-test-nav-link]')

    expect(links.length).toBe(2)
  })

  it('should accept custom classes', async () => {
    const component = await mountSuspended(AppNavigation, {
      props: {
        class: 'custom-class',
      },
    })

    expect(component.html()).toMatchSnapshot()
    expect(component.attributes('class')).toContain('custom-class')
  })
})
