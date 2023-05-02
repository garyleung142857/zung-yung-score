
enum MobileGroupType {
  Sequence = 1,
  Triplet = 2,
  Pair = 3
}

class MobileGroup {
  type: MobileGroupType
  rank: string
  constructor(type: MobileGroupType, rank: string) {
    this.type = type
    this.rank = rank
  }
}

class SuitSolution {
  groups: MobileGroup[]
  constructor(groups: MobileGroup[] = []) {
    this.groups = groups
  }
}

const RANKS: string[] = ["1", "2", "3", "4", "5", "6", "7", "8", "9"]


export const searchSuitPatterns = (suit_: number[], isHonour: boolean = false): SuitSolution[] | null => {
  let suit = [...suit_]
  if (suitLen(suit) === 0) return []
  if (suitLen(suit) % 3 === 1) return null

  if (isHonour) {
    let res: MobileGroup[] = []
    if (suitLen(suit) % 3 === 2){
      const pairIdx = suit.indexOf(2)
      if (pairIdx === -1) return null
      const pairGroup = new MobileGroup(MobileGroupType.Pair, RANKS[pairIdx])
      res.push(pairGroup)
      suit[pairIdx] -= 2
    }
    res.push(...exhaustHonour(suit))
    if (res.length === 0) return null
    return [new SuitSolution(res)]
  } else {
    if (suitLen(suit) % 3 === 2){
      let pairsRes: MobileGroup[][] = []
      for (let i = 0; i < suit.length; i++) {
        if (suit[i] >= 2) {
          let suitReducedPair = [...suit]
          suitReducedPair[i] -= 2
          let res: MobileGroup[][] = exhaust(suitReducedPair)
          
          let pairGroup = new MobileGroup(MobileGroupType.Pair, RANKS[i])
          res = res.filter(r => r.length > 0)
          if (res.length > 0) {
            res.forEach(r => r.push(pairGroup))
            pairsRes.push(...res)
          }
        }
      }
      if (pairsRes.length === 0) return null
      return pairsRes.map(r => new SuitSolution(r))
    } else {
      let res: MobileGroup[][] = exhaust(suit)
      if(res.length === 0) return null
      return res.filter(r => r.length > 0).map(r => new SuitSolution(r))
    }
  }

}

const exhaustHonour = (suit: number[]): MobileGroup[] => {
  let res: MobileGroup[] = []
  for (let i = 0; i < suit.length; i++) {
    if (suit[i] % 3 !== 0) return []
    if (suit[i] === 3) {
      let honourTripplet = new MobileGroup(MobileGroupType.Triplet, RANKS[i])
      res.push(honourTripplet)
    }
  }
  return res
}

const exhaust = (suit: number[], i = 0): MobileGroup[][] => {
  let res: MobileGroup[][] = []
  const originalRes = exhaustSequences(suit)
  if (originalRes !== null) {
    res.push(originalRes)
  }
  while (i < suit.length) {
    if (suit[i] >= 3) {
      let residual = [...suit]
      residual[i] -= 3
      let trippletGroup: MobileGroup = new MobileGroup(MobileGroupType.Triplet, RANKS[i])
      let removeTrippletRes = exhaust(residual, i + 1)
      if (removeTrippletRes !== null) {
        removeTrippletRes.forEach(r => r.push(trippletGroup))
        res.push(...removeTrippletRes)
      }
    }
    i++
  }
  return res
}

const exhaustSequences = (suit: number[]): MobileGroup[] | null => {
  let suit_ = [...suit]
  let groups_: MobileGroup[] = []
  let i = 0
  while(i < suit.length - 2) {
    if (suit_[i] === 0) {
      i++
      continue
    }
    if (suit_[i + 1] === 0 || suit_[i + 2] === 0) return null
    groups_.push(new MobileGroup(
      MobileGroupType.Sequence, 
      ''.concat(RANKS[i], RANKS[i + 1], RANKS[i + 2])
    ))
    suit_[i]--
    suit_[i + 1]--
    suit_[i + 2]--
  }
  return groups_
}

const suitLen = (suit: number[]) => {
  return suit.reduce((a, b) => a + b, 0)
}