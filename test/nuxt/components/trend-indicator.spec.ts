import { mountSuspended } from '@nuxt/test-utils/runtime'
import { describe, expect, it } from 'vitest'
import TrendIndicator from '~/components/trend-indicator.vue'

describe('TrendIndicator', () => {
  describe('Up direction', () => {
    const props: TrendResult = { change: 42, direction: 'up' }

    it('should render correctly', async () => {
      const component = await mountSuspended(TrendIndicator, { props })

      expect(component.html()).toMatchSnapshot()
    })

    it('should show the correct icon', async () => {
      const component = await mountSuspended(TrendIndicator, { props })
      const icon = component.find('[data-test-icon]')

      expect(icon.attributes('class')).toContain(
        'i-hugeicons:arrow-up-right-01',
      )
    })

    it('should show the correct badge variant', async () => {
      const component = await mountSuspended(TrendIndicator, { props })
      const badge = component.find('[data-slot="badge"]')

      expect(badge.attributes('class')).toContain('bg-secondary/20')
      expect(badge.attributes('class')).toContain('text-secondary')
    })
  })

  describe('Down direction', () => {
    const props: TrendResult = { change: 42, direction: 'down' }

    it('should render correctly', async () => {
      const component = await mountSuspended(TrendIndicator, { props })

      expect(component.html()).toMatchSnapshot()
    })

    it('should show the correct icon', async () => {
      const component = await mountSuspended(TrendIndicator, { props })
      const icon = component.find('[data-test-icon]')

      expect(icon.attributes('class')).toContain(
        'i-hugeicons:arrow-down-right-01',
      )
    })

    it('should show the correct badge variant', async () => {
      const component = await mountSuspended(TrendIndicator, { props })
      const badge = component.find('[data-slot="badge"]')

      expect(badge.attributes('class')).toContain('bg-destructive/20')
      expect(badge.attributes('class')).toContain('text-destructive')
    })
  })

  describe('Normal direction', () => {
    const props: TrendResult = { change: 42, direction: 'normal' }

    it('should render correctly', async () => {
      const component = await mountSuspended(TrendIndicator, { props })

      expect(component.html()).toMatchSnapshot()
    })

    it('should show the correct icon', async () => {
      const component = await mountSuspended(TrendIndicator, { props })
      const icon = component.find('[data-test-icon]')

      expect(icon.attributes('class')).toContain('i-hugeicons:minus-sign')
    })

    it('should show the correct badge variant', async () => {
      const component = await mountSuspended(TrendIndicator, { props })
      const badge = component.find('[data-slot="badge"]')

      expect(badge.attributes('class')).toContain('bg-primary/20')
      expect(badge.attributes('class')).toContain('text-primary')
    })
  })
})
