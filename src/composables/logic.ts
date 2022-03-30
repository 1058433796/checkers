import type { Ref } from 'vue'
import type { BlockState } from '~/types'
import { GAME, TEAM } from '~/types'

interface GameState{
  board: BlockState[][]
  gaming: GAME
  turn: TEAM
  selectOneBlock: boolean
  selectedBlock: BlockState | null
  whiteScore: number
  blackScore: number
}

export class GamePlay {
  state = ref() as Ref<GameState>
  constructor(
    public width: number,
    public height: number,
    public chessNumber: number,
  ) {
    this.reset(width, height, chessNumber)
  }

  onGameOver(winner: TEAM) {
    this.state.value.gaming = GAME.DONE
    if (winner === TEAM.BLACK)alert('BLACK is winner')
    else alert('WHITE is winner')
  }

  checkGameState() {
    if (this.state.value.blackScore === this.chessNumber * this.chessNumber)
      this.onGameOver(TEAM.BLACK)

    if (this.state.value.whiteScore === this.chessNumber * this.chessNumber)
      this.onGameOver(TEAM.WHITE)
  }

  switchTurn() {
    if (this.state.value.turn === TEAM.BLACK)
      this.state.value.turn = TEAM.WHITE
    else
      this.state.value.turn = TEAM.BLACK
  }

  LaunchGame() {
    if (this.state.value.gaming === GAME.READY) {
      this.state.value.turn = TEAM.BLACK
      this.state.value.gaming = GAME.GAMING
    }
  }

  reset(width: number, height: number, chessNumber: number) {
    this.width = width
    this.height = height
    this.chessNumber = chessNumber
    this.state.value = {
      board: this.getChessBoard(),
      gaming: GAME.READY,
      turn: TEAM.NONE,
      selectOneBlock: false,
      selectedBlock: null,
      whiteScore: 0,
      blackScore: 0,
    }
  }

  getChessBoard() {
    const chessBoard = []
    for (let y = 0; y < this.width; y++) {
      const state: BlockState[] = []
      for (let x = 0; x < this.height; x++) {
        const blockState: BlockState = this.getBlockState(x, y)
        state.push(blockState)
      }
      chessBoard.push(state)
    }
    return chessBoard
  }

  getBlockState(x: number, y: number): BlockState {
    let blockState: BlockState
    if (x < this.chessNumber && y < this.chessNumber) {
      blockState = {
        empty: false,
        x,
        y,
        team: TEAM.BLACK,
        selected: false,
        belong: TEAM.BLACK,
      }
    }
    else if (x >= this.width - this.chessNumber && y >= this.height - this.chessNumber) {
      blockState = {
        x,
        y,
        empty: false,
        team: TEAM.WHITE,
        selected: false,
        belong: TEAM.WHITE,
      }
    }
    else {
      blockState = {
        x,
        y,
        empty: true,
        selected: false,
        team: TEAM.NONE,
        belong: TEAM.NONE,
      }
    }
    return blockState
  }
}
