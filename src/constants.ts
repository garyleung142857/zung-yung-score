const TERMINALS19 = ['1m', '9m', '1p', '9p', '1s', '9s']
const HONORS = ['1z', '2z', '3z', '4z', '5z', '6z', '7z']
const TERMINALS = [...TERMINALS19, ...HONORS]

const RANKS: string[] = ['1', '2', '3', '4', '5', '6', '7', '8', '9']
const SUITS = ['m', 'p', 's', 'z']
const PLAIN_SUITS = ['m', 'p', 's']

enum Seat {
  UNSET = 0,
  EAST = 1,
  SOUTH = 2,
  WEST = 3,
  NORTH = 4
}

enum ExtraYaku {
  FINAL_DRAW = 1,
  FINAL_DISCARD = 2,
  WIN_ON_A_KONG = 3,
  ROBBING_A_KONG = 4,
  BLESSING_OF_HEAVEN = 5,
  BLESSING_OF_EARTH = 6
}

enum CallType {
  // Tsumo = 1,
  // Ron = 2,
  Chii = 3,
  Pon = 4,
  Kan = 5,
  Ckan = 6  // concealed kan
}

export {
  TERMINALS19,
  HONORS,
  TERMINALS,
  RANKS,
  SUITS,
  PLAIN_SUITS,
  Seat,
  ExtraYaku,
  CallType
}