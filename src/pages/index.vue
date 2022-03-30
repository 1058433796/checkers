<script setup lang="ts">
import Piece from '../components/Piece.vue'
const WIDTH = 10
const HEIGHT = 10
enum TEAM {BLACK, WHITE, NONE}
interface BlockState{
  empty: boolean
  team: TEAM
  x: number
  y: number
  selected: boolean
}
const chess = getChess()
const state = reactive({
  chess,
  selectOneBlock: false,
  selectedBlock: chess[0][0],
})
function generatePathBetweenBlocks(blockState1: BlockState, blockState2: BlockState) {
  // const paths = []

}
// check if the point is valid
function checkPointValidity(x: number, y: number): boolean {
  if (x < 0 || x >= WIDTH) return false
  if (y < 0 || y >= HEIGHT) return false
  return true
}
// check if the path is valid
function checkPathValidity(blockState: BlockState): boolean {
  const { x, y } = state.selectedBlock
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
      if (!state.chess[newX][newY].empty) return true
      return false
    }
    if ((Math.abs(x - blockState.x) === 2 && Math.abs(y - blockState.y) === 0)
    || (Math.abs(x - blockState.x) === 0 && Math.abs(y - blockState.y) === 2)) {
      if (!state.chess[newX][newY].empty) return true
      return false
    }
    return false
  }
}
function getBlockClass(blockState: BlockState) {
  if (blockState.selected) return 'bg-orange/50'
  return ''
}
function onBlockClicked(blockState: BlockState) {
  if (blockState.empty) {
    // Exists eleted block check validity
    if (state.selectOneBlock && checkPathValidity(blockState)) {
      const block = state.selectedBlock
      //  将相应的block信息填入
      blockState.empty = false
      blockState.team = state.selectedBlock.team
      // 将原先block信息清空
      block.empty = true
      block.team = TEAM.NONE
      block.selected = false
      // 将选中信息清空
      state.selectOneBlock = false
      // 正常来说应当启用下一行 但是Eslint不允许
      // state.selectedBlock = null
    }
  }
  else {
    // switch the eleted block to new one
    if (state.selectOneBlock)
      state.selectedBlock.selected = false
    blockState.selected = true
    state.selectOneBlock = true
    state.selectedBlock = blockState
  }
}

function getBlockState(x: number, y: number): BlockState {
  let blockState: BlockState
  if (x < 3 && y < 3) {
    blockState = {
      empty: false,
      x,
      y,
      team: TEAM.BLACK,
      selected: false,
    }
  }
  else if (x >= WIDTH - 3 && y >= HEIGHT - 3) {
    blockState = {
      x,
      y,
      empty: false,
      team: TEAM.WHITE,
      selected: false,
    }
  }
  else {
    blockState = {
      x,
      y,
      empty: true,
      selected: false,
      team: TEAM.NONE,
    }
  }
  return blockState
}
function getChess() {
  const chess = []
  for (let y = 0; y < HEIGHT; y++) {
    const state: BlockState[] = []
    for (let x = 0; x < WIDTH; x++) {
      const blockState: BlockState = getBlockState(x, y)
      state.push(blockState)
    }
    chess.push(state)
  }
  return chess
}

</script>

<template>
  <div
    v-for="rowState,y in state.chess"
    :key="y"
    flex
    justify-center
    items-center
  >
    <div
      v-for="blockState,x in rowState"
      :key="x"
    >
      <div
        border
        w-15 h-15
        flex
        justify-center
        items-center
        :class="getBlockClass(blockState)"
        @click="onBlockClicked(blockState)"
      >
        <div v-if="blockState.empty">
          {{ ' ' }}
        </div>
        <div
          v-else
          i-mdi:chess-pawn
          text-red-400
        >
        <!-- <div
          v-else
        >
          {{ blockState.team == TEAM.BLACK? 'O':'X' }}
        </div> -->
        <!-- {{ !blockState.empty?'X':'O' }} -->
        </div>
      </div>
    </div>
  </div>
</template>
