import { Group, GroupType, Shape } from "./decompose"
import { Query } from "./hand"
import { TERMINALS, RANKS } from "./constants"

class Yaku {
  cat: string
  value: number
  superior: string[]
  constructor(
    cat: string,
    value: number,
    superior: string[] = []
  ) {
    this.cat = cat
    this.value = value
    this.superior = superior
  }
}

const ALL_SEQUENCES = new Yaku('1.1', 5)
const CONCEALED_HAND = new Yaku('1.2', 5)
const NO_TERMINALS = new Yaku('1.3', 5)
const MIXED_ONE_SUIT = new Yaku('2.1.1', 30)
const PURE_ONE_SUIT = new Yaku('2.1.2', 80)
const NINE_GATES = new Yaku('2.2', 480)
const HONOR_CHUN = new Yaku('3.1.1', 10)
const HONOR_HATSU = new Yaku('3.1.2', 10)
const HONOR_HAKU = new Yaku('3.1.3', 10)
const HONOR_SEAT = new Yaku('3.1.4', 10)
const SMALL_THREE_DRAGON = new Yaku('3.2.1', 40)
const BIG_THREE_DRAGON = new Yaku('3.2.2', 130)
const SMALL_THREE_WINDS = new Yaku('3.3.1', 30)
const BIG_THREE_WINDS = new Yaku('3.3.2', 120)
const SMALL_FOUR_WINDS = new Yaku('3.3.3', 320)
const BIG_FOUR_WINDS = new Yaku('3.3.4', 400)
const ALL_HONORS = new Yaku('3.4', 320)
const ALL_TRIPLETS = new Yaku('4.1', 30)
const TWO_CONCEALED_TRIPLETS = new Yaku('4.2.1', 5)
const THREE_CONCEALED_TRIPLETS = new Yaku('4.2.2', 30)
const FOUR_CONCEALED_TRIPLETS = new Yaku('4.2.3', 125)
const ONE_KONG = new Yaku('4.3.1', 5)
const TWO_KONG = new Yaku('4.3.2', 20)
const THREE_KONG = new Yaku('4.3.3', 120)
const FOUR_KONG = new Yaku('4.3.4', 480)
const TWO_IDENTICAL_SETS = new Yaku('5.1.1', 10)
const TWO_IDENTICAL_SETS_TWICE = new Yaku('5.1.2', 60)
const THREE_IDENTICAL_SETS = new Yaku('5.1.3', 120)
const FOUR_IDENTICAL_SETS = new Yaku('5.1.4', 480)
const THREE_SIMILAR_SEQUENCES = new Yaku('6.1', 35)
const SMALL_THREE_SIMILAR_TRIPLETS = new Yaku('6.2.1', 30)
const BIG_THREE_SIMILAR_TRIPLETS = new Yaku('6.2.2', 120)
const NINE_TILE_STRAIGHT = new Yaku('7.1', 40)
const THREE_CONSECUTIVE_TRIPLETS = new Yaku('7.2.1', 100)
const FOUR_CONSECUTIVE_TRIPLETS = new Yaku('7.2.2', 200)
const MIXED_LESSER_TERMINALS = new Yaku('8.1.1', 40)
const PURE_LESSER_TERMINALS = new Yaku('8.1.2', 50)
const MIXED_GREATER_TERMINALS = new Yaku('8.1.3', 100)
const PURE_GREATER_TERMINALS = new Yaku('8.1.4', 400)
const FINAL_DRAW = new Yaku('9.1.1', 10)
const FINAL_DISCARD = new Yaku('9.1.2', 10)
const WIN_ON_KONG = new Yaku('9.1.3', 10)
const ROBBING_A_KONG = new Yaku('9.1.4', 10)
const BLESsING_OF_HEAVEN = new Yaku('9.1.5', 155)
const BLESSING_OF_EARTH = new Yaku('9.1.6', 155)
const THIRDTEEN_TERMINALS = new Yaku('10.1', 160)
const SEVEN_PAIRS = new Yaku('10.2', 30)

const evaluateQueryShape = (q: Query, shape: Shape): Yaku[] => {
  let yakus: Yaku[] = []
  const award = (yaku: Yaku) => {
    yakus.push(yaku)
  }

  const gs = shape.groups
  const pairCount = gs.filter(g => g.groupType === GroupType.Pair).length
  const sequenceCount = gs.filter(g => g.isSequence()).length
  const tripletCount = gs.filter(g => g.isTriplet()).length
  
  /* 1.0 Trivial Patterns */
  if (pairCount === 1 && sequenceCount === gs.length - 1) award(ALL_SEQUENCES)
  if (pairCount === 1 && q.isConcealed()) award(CONCEALED_HAND)
  if (!q.allTiles().some(tile => tile.isMemberOf(TERMINALS))) award(NO_TERMINALS)
  
  /* 2.0 One-Suit Patterns */
  const plainCnts = ['m', 'p', 's'].map(suit => 
    q.allTiles().filter(t => t.suit === suit).length
  )
  const honorCnts = q.allTiles().filter(t => t.suit === 'z').length
  if(plainCnts.filter(cnt => cnt === 0).length === 2) {
    award(honorCnts === 0 ? PURE_ONE_SUIT : MIXED_ONE_SUIT)
    if (q.hand.map(tile => tile.rank).sort().join('') === "1112345678999") award(NINE_GATES)
  }
  
  /* 3.0 Honor Tiles */
  if (gs.some(g => g.isTriplet() && g.tiles[0].tileStr === String(q.seat) + 'z')) award(HONOR_SEAT)

  const arrowGroups = ['5z', '6z', '7z'].map(tn => gs.find(g => g.tiles[0].suit === tn))
  if (arrowGroups[2]?.isTriplet()) award(HONOR_CHUN)
  if (arrowGroups[1]?.isTriplet()) award(HONOR_HATSU)
  if (arrowGroups[0]?.isTriplet()) award(HONOR_HAKU)
  if (
    arrowGroups.filter(g => g?.isTriplet()).length === 2 
    && arrowGroups.some(g => g?.groupType === GroupType.Pair)
  ) award(SMALL_THREE_DRAGON)
  if (arrowGroups.every(g => g?.isTriplet())) award(BIG_THREE_DRAGON) 
  
  const windGroups = ['1z', '2z', '3z', '4z'].map(tn => 
    gs.find(g => g.tiles[0].suit === tn) 
  )
  const windTripletsCnt = windGroups.filter(g => g?.isTriplet()).length
  
  if (windGroups.some(g => g?.groupType === GroupType.Pair)) {
    if (windTripletsCnt === 2) award(SMALL_THREE_WINDS)
    if (windTripletsCnt === 3) award(SMALL_FOUR_WINDS)
  } else {
    if (windTripletsCnt === 3) award(BIG_THREE_WINDS)
    if (windTripletsCnt === 4) award(BIG_FOUR_WINDS)
  }

  if (q.allTiles().every(t => t.suit === 'z')) award(ALL_HONORS)

  /* 4.0 Triplet and Kong */
  if (pairCount === 1 && tripletCount === gs.length - 1) award(ALL_TRIPLETS)

  const concealedTrippletsCnt = gs.filter(g => g.isConcealed() && g.isTriplet()).length
  if (concealedTrippletsCnt === 2) award(TWO_CONCEALED_TRIPLETS)
  if (concealedTrippletsCnt === 3) award(THREE_CONCEALED_TRIPLETS)
  if (concealedTrippletsCnt === 4) award(FOUR_CONCEALED_TRIPLETS)

  const kongCnt = gs.filter(g => g.isKan()).length
  if (kongCnt === 1) award(ONE_KONG)
  if (kongCnt === 2) award(TWO_KONG)
  if (kongCnt === 3) award(THREE_KONG)
  if (kongCnt === 4) award(FOUR_KONG)

  
  /* 10.0 Irregular Hands */
  if (gs.some(g => g.groupType === GroupType.Kokushi)) award(THIRDTEEN_TERMINALS)
  if (gs.every(g => g.groupType === GroupType.Pair)) award(SEVEN_PAIRS)

  return yakus
}
