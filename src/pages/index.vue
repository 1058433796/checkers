<script setup lang="ts">
import type { BlockState } from '~/types'
import { GAME, TEAM } from '~/types'
import ChessBlock from '~/components/ChessBlock.vue'
import { GamePlay } from '~/composables/logic'
const WIDTH = 10
const HEIGHT = 10
// CHESSNUM * CHESSNUM are chesses
const CHESSNUM = 2
const play = new GamePlay(WIDTH, HEIGHT, CHESSNUM)

// check if the path is valid
function checkPathValidity(blockState: BlockState): boolean {
  const { x, y } = play.state.value.selectedBlock
  if (!blockState.empty) return false
  const distance = Math.abs(x - blockState.x) + Math.abs(y - blockState.y)
  if (distance === 1) {
    return true
  }
  else {
    const spaceX = Math.sign(blockState.x - x)
    const spaceY = Math.sign(blockState.y - y)
    const newX = x + spaceX
    const newY = y + spaceY
    if (Math.abs(x - blockState.x) === 1 && Math.abs(y - blockState.y) === 1)
      return true

    if (Math.abs(x - blockState.x) === 2 && Math.abs(y - blockState.y) === 2) {
      if (!play.state.value.board[newY][newX].empty) return true
      return false
    }
    // alert(`x:${blockState.x} y:${blockState.y} stateX: ${x} stateY:${y}`)
    // alert(`${(Math.abs(x - blockState.x) === 0 && Math.abs(y - blockState.y) === 2)}`)
    if ((Math.abs(x - blockState.x) === 2 && Math.abs(y - blockState.y) === 0)
    || (Math.abs(x - blockState.x) === 0 && Math.abs(y - blockState.y) === 2)) {
      if (!play.state.value.board[newY][newX].empty) return true
      return false
    }
    return false
  }
}

function onBlockClicked(blockState: BlockState) {
  if (play.state.value.gaming !== GAME.GAMING) return
  if (blockState.empty) {
    // Exists eleted block check validity
    if (play.state.value.selectOneBlock && checkPathValidity(blockState)) {
      const block = play.state.value.selectedBlock
      // 记录白方和黑方得分数
      if (block?.belong !== TEAM.NONE && block?.team !== block?.belong) {
        if (block?.team === TEAM.BLACK)play.state.value.blackScore--
        else play.state.value.whiteScore--
      }
      if (blockState.belong !== TEAM.NONE && block?.team !== blockState.belong) {
        if (block?.team === TEAM.BLACK)play.state.value.blackScore++
        else play.state.value.whiteScore++
      }
      //  将相应的block信息填入
      blockState.empty = false
      blockState.team = play.state.value.selectedBlock?.team
      // 将原先block信息清空
      block.empty = true
      block.team = TEAM.NONE
      block.selected = false
      // 将选中信息清空
      play.state.value.selectOneBlock = false
      // 正常来说应当启用下一行 但是Eslint不允许
      play.state.value.selectedBlock = null

      // 切换下棋权
      play.switchTurn()
    }
  }
  else {
    if (play.state.value.turn !== blockState.team) return
    // switch the eleted block to new one
    if (play.state.value.selectOneBlock)
      play.state.value.selectedBlock.selected = false
    blockState.selected = true
    play.state.value.selectOneBlock = true
    play.state.value.selectedBlock = blockState
  }
}
watchEffect(() => {
  play.checkGameState()
})
</script>

<template>
  <div>
    <div btn @click="play.LaunchGame()">
      GO
    </div>
    {{ play.state.value.gaming === GAME.READY? 'READY': (play.state.value.gaming === GAME.GAMING? 'GAMING':'DONE') }}
    BLACK: {{ play.state.value.blackScore }} WHITE:{{ play.state.value.whiteScore }}
  </div>
  <div>
    <div
      v-for="rowState,y in play.state.value.board"
      :key="y"
      flex
      justify-center
      items-center
    >
      <div
        v-for="blockState,x in rowState"
        :key="x"
      >
        <ChessBlock
          :block-state="blockState"
          @click="onBlockClicked(blockState)"
        />
      </div>
    </div>
  </div>
</template>
