import { mountSuspended } from '@nuxt/test-utils/runtime'
import { describe, expect, it } from 'vitest'
import { gameOverview, playerOne } from '~~/test/fixtures'
import GameCard from '~/components/game-card.vue'

const props = {
  game: gameOverview,
}

describe('GameCard', () => {
  it('should render correctly with default props', async () => {
    const component = await mountSuspended(GameCard, { props })

    expect(component.html()).toMatchSnapshot()
  })

  it('should show the amount of played sets correctly', async () => {
    const component = await mountSuspended(GameCard, { props })
    const setsInfo = component.find('[data-test-sets]')

    expect(setsInfo.text()).toBe('2/2')

    const componentTwo = await mountSuspended(GameCard, {
      props: {
        ...props,
        game: {
          ...props.game,
          setsToWin: 9,
          _count: {
            sets: 1,
          },
        },
      },
    })

    const setsInfoTwo = componentTwo.find('[data-test-sets]')

    expect(setsInfoTwo.text()).toBe('1/9')
  })

  it('should show the winner', async () => {
    const component = await mountSuspended(GameCard, { props })
    const winnerInfo = component.find('[data-test-winner]')

    expect(winnerInfo.text()).toBe('...')
  })

  it('should show three dots when there is no winner', async () => {
    const componentTwo = await mountSuspended(GameCard, {
      props: {
        ...props,
        game: {
          ...props.game,
          winnerId: playerOne.id,
          winner: playerOne,
        },
      },
    })
    const winnerInfoTwo = componentTwo.find('[data-test-winner]')

    expect(winnerInfoTwo.text()).toBe(playerOne.firstName)
  })

  it('should show all players in the game', async () => {
    const componentTwo = await mountSuspended(GameCard, { props })
    const players = componentTwo.findAll('[data-test-player]')

    expect(players.length).toBe(props.game.players.length)
  })

  it('should show the play button', async () => {
    const componentTwo = await mountSuspended(GameCard, { props })
    const button = componentTwo.find('[data-test-watch-or-play]')

    expect(button.text()).toBe('Play')
  })

  it('should show the watch button when there is a winner', async () => {
    const componentTwo = await mountSuspended(GameCard, {
      props: {
        ...props,
        game: {
          ...props.game,
          winnerId: playerOne.id,
          winner: playerOne,
        },
      },
    })
    const button = componentTwo.find('[data-test-watch-or-play]')

    expect(button.text()).toBe('Watch')
  })
})
