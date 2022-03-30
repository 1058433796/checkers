export enum TEAM {BLACK, WHITE, NONE}
export enum GAME {READY, GAMING, DONE}

export interface BlockState{
  empty: boolean
  team: TEAM
  x: number
  y: number
  selected: boolean
  belong: TEAM
}
