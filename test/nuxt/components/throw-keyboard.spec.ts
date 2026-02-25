import { mountSuspended } from '@nuxt/test-utils/runtime'
import { describe, expect, it } from 'vitest'
import ThrowKeyboard from '~/components/throw-keyboard.vue'

describe('ThrowKeyboard', () => {
  it('should render correctly with default props', async () => {
    const component = await mountSuspended(ThrowKeyboard)

    expect(component.html()).toMatchSnapshot()
  })

  it('should show all segment buttons', async () => {
    const component = await mountSuspended(ThrowKeyboard)
    const segmentButtons = component.findAll('[data-test-segment-button]')

    expect(segmentButtons.length).toBe(21) // 1-20 and 25
  })

  it('should emit MISS when clicking missed', async () => {
    const component = await mountSuspended(ThrowKeyboard)

    await component.find('[data-test-missed]').trigger('click')

    const emitted = component.emitted('throw')

    expect(emitted).toBeTruthy()
    expect(emitted?.[0]).toEqual(['MISS'])
  })

  it('should emit single, double, and triple segments', async () => {
    const component = await mountSuspended(ThrowKeyboard)

    const segmentButtons = component.findAll('[data-test-segment-button]')
    const twentyButton = segmentButtons.find((button) => button.text() === '20')

    expect(twentyButton).toBeTruthy()

    await twentyButton?.trigger('click')
    await component.find('[data-test-single]').trigger('click')

    await twentyButton?.trigger('click')
    await component.find('[data-test-double]').trigger('click')

    await twentyButton?.trigger('click')
    await component.find('[data-test-triple]').trigger('click')

    const emitted = component.emitted('throw')

    expect(emitted).toBeTruthy()
    expect(emitted).toEqual([['S20'], ['D20'], ['T20']])
  })

  it('should accept custom classes', async () => {
    const component = await mountSuspended(ThrowKeyboard, {
      props: {
        class: 'custom-class',
      },
    })

    expect(component.html()).toMatchSnapshot()
    expect(component.attributes('class')).toContain('custom-class')
  })

  it('should disable buttons when disabled prop is true', async () => {
    const component = await mountSuspended(ThrowKeyboard, {
      props: {
        disabled: true,
      },
    })
    const segmentButtons = component.findAll('[data-test-segment-button]')
    const singleButton = component.find('[data-test-single]')
    const doubleButton = component.find('[data-test-double]')
    const tripleButton = component.find('[data-test-triple]')
    const missedButton = component.find('[data-test-missed]')

    expect(
      segmentButtons.every(
        (button) => button.attributes('disabled') !== undefined,
      ),
    ).toBe(true)
    expect(singleButton.attributes('disabled')).toBeDefined()
    expect(doubleButton.attributes('disabled')).toBeDefined()
    expect(tripleButton.attributes('disabled')).toBeDefined()
    expect(missedButton.attributes('disabled')).toBeDefined()
  })

  it('should update disabled states based on selected amount', async () => {
    const component = await mountSuspended(ThrowKeyboard)
    const segmentButtons = component.findAll('[data-test-segment-button]')
    const twentyButton = segmentButtons.find((button) => button.text() === '20')
    const nineteenButton = segmentButtons.find(
      (button) => button.text() === '19',
    )

    expect(twentyButton).toBeTruthy()
    expect(nineteenButton).toBeTruthy()

    await twentyButton?.trigger('click')

    expect(twentyButton?.attributes('disabled')).toBeUndefined()
    expect(nineteenButton?.attributes('disabled')).toBeDefined()
    expect(
      component.find('[data-test-single]').attributes('disabled'),
    ).toBeUndefined()
    expect(
      component.find('[data-test-double]').attributes('disabled'),
    ).toBeUndefined()
    expect(
      component.find('[data-test-triple]').attributes('disabled'),
    ).toBeUndefined()
    expect(
      component.find('[data-test-missed]').attributes('disabled'),
    ).toBeDefined()
  })

  it('should toggle selected amount when clicking the same segment twice', async () => {
    const component = await mountSuspended(ThrowKeyboard)
    const segmentButtons = component.findAll('[data-test-segment-button]')
    const twentyButton = segmentButtons.find((button) => button.text() === '20')
    const nineteenButton = segmentButtons.find(
      (button) => button.text() === '19',
    )

    expect(twentyButton).toBeTruthy()
    expect(nineteenButton).toBeTruthy()

    await twentyButton?.trigger('click')

    expect(nineteenButton?.attributes('disabled')).toBeDefined()
    expect(
      component.find('[data-test-single]').attributes('disabled'),
    ).toBeUndefined()
    expect(
      component.find('[data-test-missed]').attributes('disabled'),
    ).toBeDefined()

    await twentyButton?.trigger('click')

    expect(nineteenButton?.attributes('disabled')).toBeUndefined()
    expect(
      component.find('[data-test-single]').attributes('disabled'),
    ).toBeDefined()
    expect(
      component.find('[data-test-missed]').attributes('disabled'),
    ).toBeUndefined()
  })
})
