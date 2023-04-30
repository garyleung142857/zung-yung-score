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
  suit: Suit
  rank: Rank
  isTerminal: () => boolean
}

class Tile implements ITile {
  suit: Suit
  rank: Rank
  constructor(tileStr: string) {
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
  isConcealed: boolean
  isTriplet: boolean
  isKan: boolean
  isWinningTile: boolean
}

class Call implements ICall {
  callType: CallType
  tiles: Tile[]
  isConcealed: boolean
  isTriplet: boolean
  isKan: boolean
  isWinningTile: boolean
  constructor(callType: string, tiles: string[]) {
    // TODO: Add validity check
    this.callType = CallType[callType]
    this.tiles = tiles.map(tile => new Tile(tile))
    this.isConcealed = [CallType.Tsumo, CallType.Ckan].includes(this.callType)
    this.isTriplet = [CallType.Pon, CallType.Kan, CallType.Ckan].includes(this.callType)
    this.isKan = [CallType.Pon, CallType.Kan, CallType.Ckan].includes(this.callType)
    this.isWinningTile = [CallType.Tsumo, CallType.Ron].includes(this.callType)
  }
}

interface IQuery {
  seat: number
  hand: Tile[]
  calls: Call[]
  extra: ExtraYaku[]
}