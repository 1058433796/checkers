<script setup lang="ts">
import type { BlockState } from '~/types'
import { TEAM } from '~/types'

defineProps<{
  blockState: BlockState
}>()

function getBlockClass(blockState: BlockState): string {
  const classes = []
  // i-fa-solid-chess-board
  if (blockState.belong === TEAM.WHITE)
    classes.push('border-yellow-500/50')
  if (blockState.belong === TEAM.BLACK)
    classes.push('border-green-500/50')

  if (blockState.selected) classes.push('bg-orange/50')
  return classes.join(' ')
}

</script>
<template>
  <div
    border="0.5 gray-500/30"
    w-15 h-15
    flex
    m-1
    justify-center
    items-center
    :class="getBlockClass(blockState)"
  >
    <div v-if="blockState.empty">
      {{ ' ' }}
    </div>
    <div
      v-else
      i-mdi:chess-pawn
      :class="blockState.team === TEAM.BLACK? 'text-green-500/50': 'text-yellow-500/50'"
    />
  </div>
</template>
