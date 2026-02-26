import { unfinishedSet, winningSet } from './sets'
import { playerOne, playerTwo } from './players'

const gameFull: GameFull = {
  id: '2c8ae5cc-9993-4415-9ea7-e4a82d76c717',
  createdAt: new Date('2026-02-21T17:27:15.326Z'),
  completedAt: null,
  startScore: 501,
  outType: 'DOUBLE',
  legsToWin: 2,
  setsToWin: 1,
  endReason: null,
  winnerId: null,
  activePlayerId: playerTwo.id,
  players: [
    {
      id: 'ec450770-f7cc-4639-a94d-0bb1169fca61',
      gameId: '2c8ae5cc-9993-4415-9ea7-e4a82d76c717',
      playerId: playerTwo.id,
      seatOrder: 0,
      setsWon: 0,
      player: playerTwo,
    },
    {
      id: '37c11c1c-adc7-4b07-9d28-1a98aa89ee47',
      gameId: '2c8ae5cc-9993-4415-9ea7-e4a82d76c717',
      playerId: playerOne.id,
      seatOrder: 1,
      setsWon: 0,
      player: playerOne,
    },
  ],
  sets: [unfinishedSet, winningSet],
  winner: null,
  startPlayerId: null,
}

export default gameFull
