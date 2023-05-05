import { Seat, ExtraYaku } from './constants'
import { Call } from './call'
import { Tile } from './tile'
import { patternAll } from './decompose'
import { Analysis } from './analysis'

interface IQuery {
  seat: Seat
  hand: Tile[]
  winTile: Tile
  isTsumo: boolean
  calls: Call[]
  extras: ExtraYaku[]
}

export class Query implements IQuery {
  seat: Seat = Seat.UNSET
  hand: Tile[] = []
  winTile: Tile
  isTsumo: boolean
  calls: Call[]
  extras: ExtraYaku[]
  constructor (data: any) {
    this.seat = data?.seat
    this.hand = data.hand ? data.hand.map((tileStr: string) => new Tile(tileStr)) : [] 
    this.winTile = new Tile(data.winTile)
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
  get result() {
    if (!this.winTile) return
    const res: Analysis[] = []
    const winningShapes = patternAll(this)
    winningShapes.forEach(shape => {
      const analysis = new Analysis(this, shape)
      if (res.find(r => r.yakusStr === analysis.yakusStr) === undefined) res.push(analysis)
    })
    return res.sort((a, b) => a.score > b.score ? -1 : 1).map(r => r.analysis)
  }
}

