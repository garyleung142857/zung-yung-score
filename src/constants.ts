import { Tile } from "./hand"

const TERMINALS19 = [
  new Tile('1m'), new Tile('9m'), new Tile('1p'), new Tile('9p'), new Tile('1s'), new Tile('9s')
]

const HONORS = [
  new Tile('1z'), new Tile('2z'), new Tile('3z'), new Tile('4z'), new Tile('5z'), new Tile('6z'), new Tile('7z')
]

const TERMINALS = [...TERMINALS19, ...HONORS]


const RANKS: string[] = ["1", "2", "3", "4", "5", "6", "7", "8", "9"]
const SUITS = ['m', 'p', 's', 'z']

export {
  TERMINALS19,
  HONORS,
  TERMINALS,
  RANKS,
  SUITS
}