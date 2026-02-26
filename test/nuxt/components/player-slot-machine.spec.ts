import { mountSuspended } from '@nuxt/test-utils/runtime'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { playerOne, playerTwo } from '~~/test/fixtures'
import PlayerSlotMachine from '~/components/player-slot-machine.vue'

const players: GameFull['players'] = [
  {
    id: 'gp-1',
    gameId: 'game-1',
    playerId: playerOne.id,
    seatOrder: 0,
    setsWon: 0,
    player: playerOne,
  },
  {
    id: 'gp-2',
    gameId: 'game-1',
    playerId: playerTwo.id,
    seatOrder: 1,
    setsWon: 0,
    player: playerTwo,
  },
]

describe('PlayerSlotMachine', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('should render correctly with default props', async () => {
    const component = await mountSuspended(PlayerSlotMachine, {
      props: { players },
    })

    expect(component.html()).toMatchSnapshot()
  })

  it('should show "Who throws first?" label initially', async () => {
    const component = await mountSuspended(PlayerSlotMachine, {
      props: { players },
    })
    const label = component.find('[data-test-label]')

    expect(label.text()).toBe('Who throws first?')
  })

  it('should show no player name in the display initially', async () => {
    const component = await mountSuspended(PlayerSlotMachine, {
      props: { players },
    })
    const name = component.find('[data-test-displayed-name]')

    expect(name.exists()).toBe(false)
  })

  it('should render a button for each player', async () => {
    const component = await mountSuspended(PlayerSlotMachine, {
      props: { players },
    })
    const buttons = component.findAll('[data-test-player-button]')

    expect(buttons).toHaveLength(players.length)
    expect(buttons[0]!.text()).toContain(playerOne.nickName)
    expect(buttons[1]!.text()).toContain(playerTwo.nickName)
  })

  it('should render the random button', async () => {
    const component = await mountSuspended(PlayerSlotMachine, {
      props: { players },
    })
    const randomBtn = component.find('[data-test-random-button]')

    expect(randomBtn.exists()).toBe(true)
    expect(randomBtn.text()).toContain('Random')
  })

  it('should emit select with the correct playerId when a player button is clicked', async () => {
    const component = await mountSuspended(PlayerSlotMachine, {
      props: { players },
    })
    const buttons = component.findAll('[data-test-player-button]')
    await buttons[0]!.trigger('click')

    expect(component.emitted('select')).toBeTruthy()
    expect(component.emitted('select')![0]).toEqual([playerOne.id])
  })

  it('should emit select for each player when their button is clicked', async () => {
    const component = await mountSuspended(PlayerSlotMachine, {
      props: { players },
    })
    const buttons = component.findAll('[data-test-player-button]')
    await buttons[0]!.trigger('click')
    await buttons[1]!.trigger('click')

    expect(component.emitted('select')).toHaveLength(2)
    expect(component.emitted('select')![0]).toEqual([playerOne.id])
    expect(component.emitted('select')![1]).toEqual([playerTwo.id])
  })

  it('should show "Rolling..." label and hide player/random buttons while spinning', async () => {
    const component = await mountSuspended(PlayerSlotMachine, {
      props: { players },
    })
    const randomBtn = component.find('[data-test-random-button]')
    await randomBtn.trigger('click')
    const label = component.find('[data-test-label]')

    expect(label.text()).toBe('Rolling...')
    expect(component.find('[data-test-player-button]').exists()).toBe(false)
    expect(component.find('[data-test-random-button]').exists()).toBe(false)
  })

  it('should cycle through player names in the display while spinning', async () => {
    const component = await mountSuspended(PlayerSlotMachine, {
      props: { players },
    })
    const randomBtn = component.find('[data-test-random-button]')
    await randomBtn.trigger('click')
    await vi.advanceTimersByTimeAsync(200)
    const displayedName = component.find('[data-test-displayed-name]')

    expect(displayedName.exists()).toBe(true)
    expect(displayedName.text()).not.toBe('')
  })

  it('should show "Goes first!" label and display result after spin completes', async () => {
    const component = await mountSuspended(PlayerSlotMachine, {
      props: { players },
    })
    const randomBtn = component.find('[data-test-random-button]')
    await randomBtn.trigger('click')
    await vi.runAllTimersAsync()
    const label = component.find('[data-test-label]')

    expect(label.text()).toBe('Goes first!')

    const displayedName = component.find('[data-test-displayed-name]')

    expect(displayedName.exists()).toBe(true)
    expect(displayedName.text()).not.toBe('')
  })

  it('should emit select with the winner playerId after spin ends', async () => {
    const component = await mountSuspended(PlayerSlotMachine, {
      props: { players },
    })
    const randomBtn = component.find('[data-test-random-button]')
    await randomBtn.trigger('click')
    await vi.runAllTimersAsync()
    const emitted = component.emitted('select')

    expect(emitted).toBeTruthy()
    expect(emitted).toHaveLength(1)

    const emittedId = emitted![0]![0] as string

    expect(players.map((p) => p.playerId)).toContain(emittedId)
  })

  it('should not start a new spin while already spinning', async () => {
    const component = await mountSuspended(PlayerSlotMachine, {
      props: { players },
    })
    const randomBtn = component.find('[data-test-random-button]')
    await randomBtn.trigger('click')
    await vi.advanceTimersByTimeAsync(100)
    await vi.runAllTimersAsync()

    expect(component.emitted('select')).toHaveLength(1)
  })

  it('should apply result classes to the display after spin', async () => {
    const component = await mountSuspended(PlayerSlotMachine, {
      props: { players },
    })
    const randomBtn = component.find('[data-test-random-button]')
    await randomBtn.trigger('click')
    await vi.runAllTimersAsync()
    const display = component.find('[data-test-display]')

    expect(display.classes()).toContain('bg-primary')
  })

  it('should not emit select when a player button is clicked during spin', async () => {
    const component = await mountSuspended(PlayerSlotMachine, {
      props: { players },
    })
    const randomBtn = component.find('[data-test-random-button]')
    await randomBtn.trigger('click')

    expect(component.find('[data-test-player-button]').exists()).toBe(false)
    expect(component.emitted('select')).toBeFalsy()
  })
})
