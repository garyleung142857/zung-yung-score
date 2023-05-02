type Suit = "m" | "p" | "s" | "z"
type Rank = "1" | "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9"

enum Seat {
  UNSET = 0,
  EAST = 1,
  SOUTH = 2,
  WEST = 3,
  NORTH = 4
}

enum CallType {
  Tsumo = 1,
  Ron = 2,
  Chii = 3,
  Pon = 4,
  Kan = 5,
  Ckan = 6  // concealed kan
}

enum ExtraYaku {
  FINAL_DRAW = 1,
  FINAL_DISCARD = 2,
  WIN_ON_A_KONG = 3,
  ROBBING_A_KONG = 4,
  BLESSING_OF_HEAVEN = 5,
  BLESSING_OF_EARTH = 6
}

interface ITile {
  tileStr: string
  suit: Suit
  rank: Rank
  isTerminal: () => boolean
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
  isTerminal() {
    return this.suit === "z" || ["1", "9"].includes(this.rank)
  }
}

interface ICall {
  callType: CallType
  tiles: Tile[]
  isWinningTile: () => boolean
}

export class Call implements ICall {
  callType: CallType
  tiles: Tile[]
  constructor(callType: CallType, tiles: string[]) {
    // TODO: Add validity check
    this.callType = callType
    this.tiles = tiles.map(tileStr => new Tile(tileStr))
  }
  isWinningTile() {
    return [CallType.Tsumo, CallType.Ron].includes(this.callType)
  }
}

class Analysis {

}

interface IQuery {
  seat: Seat
  hand: Tile[]
  calls: Call[]
  extra: ExtraYaku[]
}

export class Query implements IQuery {
  seat: Seat
  hand: Tile[]
  calls: Call[]
  extra: ExtraYaku[]
  constructor (seat: Seat, hand: string[], calls: Call[], extra: ExtraYaku[]) {
    this.seat = seat
    this.hand = hand.map(tileStr => new Tile(tileStr))
    this.calls = calls
    this.extra = extra
  }
  mobileTiles() {
    const winningTile = this.calls.find(call => call.isWinningTile())!.tiles[0]
    return [...this.hand, winningTile]
  }
}