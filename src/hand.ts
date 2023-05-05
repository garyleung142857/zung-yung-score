import { Seat, ExtraYaku, CallType } from './constants'

type Suit = "m" | "p" | "s" | "z"
type Rank = "1" | "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9"

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

class Analysis {

}

interface IQuery {
  seat: Seat
  hand: Tile[]
  winTile: Tile
  isTsumo: boolean
  calls: Call[]
  extras: ExtraYaku[]
}

export class Query implements IQuery {
  seat: Seat
  hand: Tile[]
  winTile: Tile
  isTsumo: boolean
  calls: Call[]
  extras: ExtraYaku[]
  constructor (data: any) {
    this.seat = data?.seat || Seat.UNSET
    this.hand = data.hand ? data.hand.map((tileStr: string) => new Tile(tileStr)) : [] 
    this.winTile = data?.winTile || null 
    this.isTsumo = data?.isTsumo || false
    this.calls = data?.calls || []
    this.extras = data?.extras || []
  }
  setSeat(seat: Seat) {
    this.seat = seat
  }
  setHand(hand: Tile[]) {
    this.hand = hand
  }
  setWinTile(winTile: Tile) {
    this.winTile = winTile
  }
  setIsTsumo(isTsumo: boolean) {
    this.isTsumo = isTsumo
  }
  setCalls(calls: Call[]) {
    this.calls = calls
  }
  setExtras(extras: ExtraYaku[]) {
    this.extras = extras
  }
  mobileTiles() {
    return [...this.hand, this.winTile]
  }
  allTiles() {
    return [...this.hand, this.winTile, ...this.calls.flatMap(call => call.tiles)]
  }
  isConcealed() {
    return this.calls.filter(call => call.callType !== CallType.Ckan).length === 0
  }
}