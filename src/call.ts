import { CallType } from './constants'
import { Tile } from './tile'

interface ICall {
  callType: CallType
  tiles: Tile[]
}

export class Call implements ICall {
  callType: CallType
  tiles: Tile[]
  constructor(callType: CallType, tiles: string[]) {
    // TODO: Add validity check
    this.callType = callType
    this.tiles = tiles.map(tileStr => new Tile(tileStr))
  }
}
