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
    this.suit = (tileStr[1] as Suit)
    this.rank = (tileStr[0] as Rank)
  }
  equals(other: Tile) {
    return this.tileStr === other.tileStr
  }
  isMemberOf(tiles: string[]) {
    return tiles.find(t => t === this.tileStr) !== undefined
  }
}
