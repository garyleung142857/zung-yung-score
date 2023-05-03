import { RANKS } from "./constants"

export enum MobileGroupType {
  Sequence = 1,
  Triplet = 2,
  Pair = 3
}

export class MobileGroup {
  type: MobileGroupType
  tileNames: string[]
  constructor(type: MobileGroupType, tileNames: string[]) {
    this.type = type
    this.tileNames = tileNames
  }
}

export class SuitSolution {
  suit: string
  groups: MobileGroup[]
  constructor(suit: string, groups: MobileGroup[] = []) {
    this.suit = suit
    this.groups = groups
  }
}

let suit: string

export const searchSuitPatterns = (ranks_: number[], suit_: string): SuitSolution[] => {
  let ranks = [...ranks_]
  suit = suit_
  if (suitLen(ranks) === 0) return [new SuitSolution(suit)]
  if (suitLen(ranks) % 3 === 1) return []

  if (suit === "z") {
    let res: MobileGroup[] = []
    if (suitLen(ranks) % 3 === 2){
      const pairIdx = ranks.indexOf(2)
      if (pairIdx === -1) return []
      const pairGroup = new MobileGroup(MobileGroupType.Pair, [RANKS[pairIdx] + suit])
      res.push(pairGroup)
      ranks[pairIdx] -= 2
    }
    res.push(...exhaustHonour(ranks))
    if (res.length === 0) return []
    return [new SuitSolution(suit, res)]
  } else {
    if (suitLen(ranks) % 3 === 2){
      let pairsRes: MobileGroup[][] = []
      for (let i = 0; i < ranks.length; i++) {
        if (ranks[i] >= 2) {
          let suitReducedPair = [...ranks]
          suitReducedPair[i] -= 2
          let res: MobileGroup[][] = exhaust(suitReducedPair)
          
          let pairGroup = new MobileGroup(MobileGroupType.Pair, [RANKS[i] + suit])

          if (res.length > 0) {
            res.forEach(r => r.push(pairGroup))
            pairsRes.push(...res)
          }
        }
      }
      if (pairsRes.length === 0) return []
      return pairsRes.map(r => new SuitSolution(suit, r))
    } else {
      let res: MobileGroup[][] = exhaust(ranks)
      if(res.length === 0) return []
      return res.filter(r => r.length > 0).map(r => new SuitSolution(suit, r))
    }
  }
}

const exhaustHonour = (ranks: number[]): MobileGroup[] => {
  let res: MobileGroup[] = []
  for (let i = 0; i < ranks.length; i++) {
    if (ranks[i] % 3 !== 0) return []
    if (ranks[i] === 3) {
      let honourTripplet = new MobileGroup(MobileGroupType.Triplet, [RANKS[i] + suit])
      res.push(honourTripplet)
    }
  }
  return res
}

const exhaust = (ranks: number[], i = 0): MobileGroup[][] => {
  if (ranks.length === 0) return [[]]
  let res: MobileGroup[][] = []
  const originalRes = exhaustSequences(ranks)
  if (originalRes !== null) {
    res.push(originalRes)
  }
  while (i < ranks.length) {
    if (ranks[i] >= 3) {
      let residual = [...ranks]
      residual[i] -= 3
      let trippletGroup: MobileGroup = new MobileGroup(MobileGroupType.Triplet, [RANKS[i] + suit])
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

const exhaustSequences = (ranks_: number[]): MobileGroup[] | null => {
  let ranks = [...ranks_]
  let groups_: MobileGroup[] = []
  let i = 0
  while(i < ranks.length - 2) {
    if (ranks[i] === 0) {
      i++
      continue
    }
    if (ranks[i + 1] === 0 || ranks[i + 2] === 0) return null
    groups_.push(new MobileGroup(
      MobileGroupType.Sequence, 
      [RANKS[i] + suit, RANKS[i + 1] + suit, RANKS[i + 2] + suit])
    )
    ranks[i]--
    ranks[i + 1]--
    ranks[i + 2]--
  }
  return groups_
}

const suitLen = (ranks: number[]) => {
  return ranks.reduce((a, b) => a + b, 0)
}