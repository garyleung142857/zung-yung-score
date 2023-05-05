import { CallType, Suit, Rank } from './constants'

interface ITile {
  tileStr: string
  suit: Suit
  rank: Rank
}

export class Tile implements ITile {
  tileStr: string
  suit: Suit
  rank: Rank
  constructor(tileStr: string) {
    this.tileStr = tileStr
    this.suit = <Suit>tileStr[1]
    this.rank = <Rank>tileStr[0]
  }
  equals(other: Tile) {
    return this.tileStr === other.tileStr
  }
  isMemberOf(tiles: string[]) {
    return tiles.find(t => t === this.tileStr) !== undefined
  }
}

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
