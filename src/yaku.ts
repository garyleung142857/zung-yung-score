import { Group, GroupType } from "./decompose"
import { Query } from "./hand"
import { TERMINALS, RANKS } from "./constants"

class Yaku {
  cat: string // catalog number
  isValid: (query: Query, groups: Group[]) => boolean
  value: number
  superiorYakus: string[] // cat[]
  constructor(
    cat: string,
    isValid: (query: Query, groups: Group[]) => boolean,
    value: number,
    superiorYakus: string[] = []
  ) {
    this.cat = cat
    this.isValid = isValid
    this.value = value
    this.superiorYakus = superiorYakus
  }
}

/* 1.0 Trivial patterns */
const ALL_SEQUENCES = new Yaku(
  '1.1',
  (q, gs) => {
    const pairCount = gs.filter(g => g.groupType === GroupType.Pair).length
    const sequenceCount = gs.filter(g => g.isSequence()).length
    return pairCount === 1 && sequenceCount === gs.length - 1
  },
  5
)

const CONCEALED_HAND = new Yaku(
  '1.2',
  (q, gs) => q.calls.length === 0,
  5,
  ['10.1', '10.2']
)

const NO_TERMINALS = new Yaku(
  '1.3',
  (q, gs) => !q.allTiles().some(tile => tile.isMemberOf(TERMINALS)),
  5
)

/* 2.0 One-Suit patterns */
const MIXED_ONE_SUIT = new Yaku(
  '2.1.1',
  (q, gs) => {
    const plainCnts = ['m', 'p', 's'].map(suit => 
      q.allTiles().filter(t => t.suit === suit).length
    )
    return plainCnts.filter(cnt => cnt === 0).length === 2
  },
  30
)

const PURE_ONE_SUIT = new Yaku(
  '2.1.2',
  (q, gs) => q.hand[0].suit !== "z" && q.allTiles().every(t => t.suit === q.hand[0].suit),
  80
)

const NINE_GATES = new Yaku(
  '2.2',
  (q, gs) => {
    if (q.hand[0].suit === 'z' || !q.hand.every(t => t.suit === q.hand[0].suit)) return false
    return q.hand.map(tile => tile.rank).sort().join('') === "1112345678999"
  },
  480
)

/* 3.0 Honor Tiles */
const HONOR_CHUN = new Yaku(
  '3.1.1',
  (q, gs) => gs.some(g => g.isTriplet() && g.tiles[0].tileStr === '7z'),
  10
)

const HONOR_HATSU = new Yaku(
  '3.1.2',
  (q, gs) => gs.some(g => g.isTriplet() && g.tiles[0].tileStr === '6z'),
  10
)

const HONOR_HAKU = new Yaku(
  '3.1.3',
  (q, gs) => gs.some(g => g.isTriplet() && g.tiles[0].tileStr === '5z'),
  10
)

const HONOR_SEAT = new Yaku(
  '3.1.4',
  (q, gs) => gs.some(g => g.isTriplet() && g.tiles[0].tileStr === String(q.seat) + 'z'),
  10
)

const SMALL_THREE_DRAGON = new Yaku(
  '3.2.1',
  (q, gs) => {
    const groups = ['5z', '6z', '7z'].map(tn => 
      gs.find(g => g.tiles[0].suit === tn) 
    )
    return groups.filter(g => g?.isTriplet()).length === 2
      && groups.some(g => g?.groupType === GroupType.Pair)
  },
  40,
  ['3.2.2']
)

const BIG_THREE_DRAGON = new Yaku(
  '3.2.2',
  (q, gs) => {
    const groups = ['5z', '6z', '7z'].map(tn => 
      gs.find(g => g.tiles[0].suit === tn) 
    )
    return groups.filter(g => g?.isTriplet()).length === 3
  },
  130,
)

const SMALL_THREE_WINDS = new Yaku(
  '3.3.1',
  (q, gs) => {
    const groups = ['1z', '2z', '3z', '4z'].map(tn => 
      gs.find(g => g.tiles[0].suit === tn) 
    )
    return groups.filter(g => g?.isTriplet()).length === 2
      && groups.some(g => g?.groupType === GroupType.Pair)
  },
  30,
  ['3.3.2', '3.3.3', '3.3.4']
)

const BIG_THREE_WINDS = new Yaku(
  '3.3.1',
  (q, gs) => {
    const groups = ['1z', '2z', '3z', '4z'].map(tn => 
      gs.find(g => g.tiles[0].suit === tn) 
    )
    return groups.filter(g => g?.isTriplet()).length === 3
  },
  120,
  ['3.3.3', '3.3.4']
)

const SMALL_FOUR_WINDS = new Yaku(
  '3.3.3',
  (q, gs) => {
    const groups = ['1z', '2z', '3z', '4z'].map(tn => 
      gs.find(g => g.tiles[0].suit === tn) 
    )
    return groups.filter(g => g?.isTriplet()).length === 3
      && groups.some(g => g?.groupType === GroupType.Pair)
  },
  320,
  ['3.3.4']
)

const BIG_FOUR_WINDS = new Yaku(
  '3.3.4',
  (q, gs) => {
    const groups = ['1z', '2z', '3z', '4z'].map(tn => 
      gs.find(g => g.tiles[0].suit === tn) 
    )
    return groups.filter(g => g?.isTriplet()).length === 4
  },
  400
)

const ALL_HONORS = new Yaku(
  '3.4',
  (q, gs) => q.allTiles().every(t => t.suit === 'z'),
  320
)

/* Triplets and Kong */
const ALL_TRIPLETS = new Yaku(
  '4.1',
  (q, gs) => {
    const pairCount = gs.filter(g => g.groupType === GroupType.Pair).length
    const setCount = gs.filter(g => g.isTriplet()).length
    return pairCount === 1 && setCount === gs.length - 1
  },
  30
)

const TWO_CONCEALED_TRIPLETS = new Yaku(
  '4.2.1',
  (q, gs) => gs.filter(g => g.isConcealed() && g.isTriplet()).length === 2,
  5,
  ['4.2.2', '4.2.3']
)

const THREE_CONCEALED_TRIPLETS = new Yaku(
  '4.2.2',
  (q, gs) => gs.filter(g => g.isConcealed() && g.isTriplet()).length === 3,
  30,
  ['4.2.3']
)

const FOUR_CONCEALED_TRIPLETS = new Yaku(
  '4.2.3',
  (q, gs) => gs.filter(g => g.isConcealed() && g.isTriplet()).length === 4,
  125
)

const ONE_KONG = new Yaku(
  '4.3.1',
  (q, gs) => gs.filter(g => g.isKan()).length === 1,
  5,
  ['4.3.2', '4.3.3', '4.3.4']
)

const TWO_KONG = new Yaku(
  '4.3.2',
  (q, gs) => gs.filter(g => g.isKan()).length === 2,
  20,
  ['4.3.3', '4.3.4']
)

const THREE_KONG = new Yaku(
  '4.3.1',
  (q, gs) => gs.filter(g => g.isKan()).length === 3,
  120,
  ['4.3.4']
)

const FOUR_KONG = new Yaku(
  '4.3.1',
  (q, gs) => gs.filter(g => g.isKan()).length === 4,
  480
)

/* 10.0 Irregular Hands */
const THIRDTEEN_TERMINALS = new Yaku(
  '10.1',
  (q, gs) => gs[0].groupType === GroupType.Kokushi,
  160
)

const SEVEN_PAIRS = new Yaku(
  '10.2',
  (q, gs) => gs.every(g => g.groupType === GroupType.Pair),
  30
)