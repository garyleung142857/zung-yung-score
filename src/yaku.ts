import { Group, GroupType } from "./decompose"
import { Query } from "./query"
import { TERMINALS, RANKS, ExtraYaku, PLAIN_SUITS, CallType } from "./constants"

class Yaku {
  cat: string
  score: number
  superior: string[]
  constructor(
    cat: string,
    score: number,
    superior: string[] = []
  ) {
    this.cat = cat
    this.score = score
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
const TWO_IDENTICAL_SEQUENCES = new Yaku('5.1.1', 10)
const TWO_IDENTICAL_SEQUENCES_TWICE = new Yaku('5.1.2', 60)
const THREE_IDENTICAL_SEQUENCES = new Yaku('5.1.3', 120)
const FOUR_IDENTICAL_SEQUENCES = new Yaku('5.1.4', 480)
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
const BLESSING_OF_HEAVEN = new Yaku('9.1.5', 155)
const BLESSING_OF_EARTH = new Yaku('9.1.6', 155)
const THIRDTEEN_TERMINALS = new Yaku('10.1', 160)
const SEVEN_PAIRS = new Yaku('10.2', 30)

const evaluateQueryShape = (q: Query, gs: Group[]): Yaku[] => {
  const yakus: Yaku[] = []
  const award = (yaku: Yaku) => {
    yakus.push(yaku)
  }

  const pairCount = gs.filter(g => g.groupType === GroupType.Pair).length
  const sequenceCount = gs.filter(Group.isSequence).length
  
  /* 1.0 Trivial Patterns, and 10.2 */
  if (pairCount === 1 && sequenceCount === gs.length - 1) award(ALL_SEQUENCES)
  if (pairCount === 1 && q.calls.filter(call => call.callType !== CallType.Ckan)) award(CONCEALED_HAND)
  if (!q.allTiles().some(tile => tile.isMemberOf(TERMINALS))) award(NO_TERMINALS)
  if (pairCount === gs.length) award(SEVEN_PAIRS)
  
  /* 2.0 One-Suit Patterns */
  const plainCnts = ['m', 'p', 's'].map(suit => 
    q.allTiles().filter(t => t.suit === suit).length
  )
  const isPure = q.allTiles().every(t => t.suit !== 'z')
  if(plainCnts.filter(cnt => cnt === 0).length === 2) {
    award(isPure ? PURE_ONE_SUIT : MIXED_ONE_SUIT)
    if (q.hand.map(tile => tile.rank).sort().join('') === "1112345678999") award(NINE_GATES)
  }
  
  /* 3.0 Honor Tiles */
  if (gs.some(g => Group.isTriplet(g) && g.tiles[0].tileStr === String(q.seat) + 'z')) award(HONOR_SEAT)

  const arrowGroups = ['5z', '6z', '7z'].map(tn => gs.find(g => g.tiles[0].suit === tn))
  if (arrowGroups[2] && Group.isTriplet(arrowGroups[2])) award(HONOR_CHUN)
  if (arrowGroups[1] && Group.isTriplet(arrowGroups[1])) award(HONOR_HATSU)
  if (arrowGroups[0] && Group.isTriplet(arrowGroups[0])) award(HONOR_HAKU)
  if (
    arrowGroups.filter(g => g && Group.isTriplet(g)).length === 2 
    && arrowGroups.some(g => g && g!.groupType === GroupType.Pair)
  ) award(SMALL_THREE_DRAGON)
  if (arrowGroups.every(g => g && Group.isTriplet(g))) award(BIG_THREE_DRAGON) 
  
  const windGroups = ['1z', '2z', '3z', '4z'].map(tn => 
    gs.find(g => g.tiles[0].suit === tn) 
  )
  const windTripletsCnt = windGroups.filter(g => g && Group.isTriplet(g)).length
  
  if (windGroups.some(g => g?.groupType === GroupType.Pair)) {
    if (windTripletsCnt === 2) award(SMALL_THREE_WINDS)
    if (windTripletsCnt === 3) award(SMALL_FOUR_WINDS)
  } else {
    if (windTripletsCnt === 3) award(BIG_THREE_WINDS)
    if (windTripletsCnt === 4) award(BIG_FOUR_WINDS)
  }

  if (q.allTiles().every(t => t.suit === 'z')) award(ALL_HONORS)

  /* 4.0 Triplet and Kong */
  const tripletCount = gs.filter(Group.isTriplet).length
  if (pairCount === 1 && tripletCount === gs.length - 1) award(ALL_TRIPLETS)

  const concealedTrippletsCnt = gs.filter(Group.isConcealed).filter(Group.isTriplet).length
  if (concealedTrippletsCnt === 2) award(TWO_CONCEALED_TRIPLETS)
  if (concealedTrippletsCnt === 3) award(THREE_CONCEALED_TRIPLETS)
  if (concealedTrippletsCnt === 4) award(FOUR_CONCEALED_TRIPLETS)

  const kongCnt = gs.filter(Group.isKan).length
  if (kongCnt === 1) award(ONE_KONG)
  if (kongCnt === 2) award(TWO_KONG)
  if (kongCnt === 3) award(THREE_KONG)
  if (kongCnt === 4) award(FOUR_KONG)

  /* 5.0 Identical sequences */
  const sequencesFirstTiles = gs.filter(Group.isSequence).map(g => g.tiles[0])
  if (sequenceCount >= 2){
    const identicalSequenceCnts = sequencesFirstTiles.map(t => 
      sequencesFirstTiles.filter(t2 => t.equals(t2)).length
    )
    if (identicalSequenceCnts.filter(cnt => cnt === 2).length === 2) award(TWO_IDENTICAL_SEQUENCES)
    if (identicalSequenceCnts.filter(cnt => cnt === 2).length === 4) award(TWO_IDENTICAL_SEQUENCES_TWICE)
    if (identicalSequenceCnts.some(cnt => cnt === 3)) award(THREE_IDENTICAL_SEQUENCES)
    if (identicalSequenceCnts.some(cnt => cnt === 4)) award(FOUR_IDENTICAL_SEQUENCES)
  }

  /* 6.0 Similar sets, and 7.0 Consecutive sets */
  if (sequenceCount >= 3) {
    for (let i = 0; i < RANKS.length - 2; i++) {
      if (PLAIN_SUITS.every(suit => 
        sequencesFirstTiles.some(tile => tile.tileStr === RANKS[i] + suit)
      )) award(THREE_SIMILAR_SEQUENCES) 
    }

    if (PLAIN_SUITS.some(suit => {
      ["1", "4", "7"].every(rank => {
        sequencesFirstTiles.some(tile => tile.tileStr === rank + suit)
      })
    })) award(NINE_TILE_STRAIGHT)
  }

  const tripletsTiles = gs.filter(Group.isTriplet).map(g => g.tiles[0])
  const pairTile = gs.find(g => g.groupType === GroupType.Pair)?.tiles[0]
  if (pairTile && PLAIN_SUITS.includes(pairTile!.suit)) {
    const other2Suits = PLAIN_SUITS.filter(suit => suit !== pairTile.suit)
    if (other2Suits.every(suit => tripletsTiles.some(tile => tile.tileStr === pairTile.rank + suit))) {
      award(SMALL_THREE_SIMILAR_TRIPLETS)
    }
  }
  
  if (tripletCount >= 3) {
    if(RANKS.some(rank => 
      PLAIN_SUITS.every(suit => tripletsTiles.some(tile => tile.tileStr === rank + suit))
    )) award (BIG_THREE_SIMILAR_TRIPLETS)

    PLAIN_SUITS.forEach(suit => {
      const suitTripplets = RANKS.map(rank => tripletsTiles.some(tile => tile.tileStr === rank + suit))
      let max = 0
      let current = 0
      for (const hasTripplet of suitTripplets) {
        current = hasTripplet ? 0 : current + 1
        max = Math.max(current, max)
      }
      if (max === 3) award(THREE_CONSECUTIVE_TRIPLETS)
      if (max === 4) award(FOUR_CONSECUTIVE_TRIPLETS)
    })
  }

  /* 8.0 Terminals, and 10.1 */
  if (!gs.some(g => g.groupType === GroupType.Kokushi)) {
    if (q.allTiles().every(tile => tile.isMemberOf(TERMINALS))){
      award(isPure ? PURE_GREATER_TERMINALS : MIXED_GREATER_TERMINALS)
    } else if (gs.every(g => g.tiles.some(t => t.isMemberOf(TERMINALS)))) {
      award(isPure ? PURE_LESSER_TERMINALS : MIXED_LESSER_TERMINALS)
    }
  } else {
    award(THIRDTEEN_TERMINALS)
  }

  /* 9.0 Incidental bonuses */
  if (q.extras.includes(ExtraYaku.FINAL_DRAW)) award(FINAL_DRAW)
  if (q.extras.includes(ExtraYaku.FINAL_DISCARD)) award(FINAL_DISCARD)
  if (q.extras.includes(ExtraYaku.WIN_ON_A_KONG)) award(WIN_ON_KONG)
  if (q.extras.includes(ExtraYaku.ROBBING_A_KONG)) award(ROBBING_A_KONG)
  if (q.extras.includes(ExtraYaku.BLESSING_OF_HEAVEN)) award(BLESSING_OF_HEAVEN)
  if (q.extras.includes(ExtraYaku.BLESSING_OF_EARTH)) award(BLESSING_OF_EARTH)

  return yakus
}

export {
  Yaku,
  evaluateQueryShape
}