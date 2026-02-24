import { mountSuspended } from '@nuxt/test-utils/runtime'
import { describe, expect, it } from 'vitest'
import AppHeader from '~/components/app-header.vue'

describe('AppHeader', () => {
  it('should render correctly with default props', async () => {
    const component = await mountSuspended(AppHeader)

    expect(component.html()).toMatchSnapshot()
  })

  it('should accept custom classes', async () => {
    const component = await mountSuspended(AppHeader, {
      props: {
        class: 'custom-class',
      },
    })

    expect(component.html()).toMatchSnapshot()
    expect(component.attributes('class')).toContain('custom-class')
  })
})
