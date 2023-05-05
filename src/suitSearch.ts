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

let suit: string

export const searchSuitPatterns = (rks: number[], s: string): MobileGroup[][] => {
  const ranks = [...rks]
  suit = s
  if (suitLen(ranks) === 0) return [[]]
  if (suitLen(ranks) % 3 === 1) return []

  if (suit === "z") {
    const res: MobileGroup[] = []
    if (suitLen(ranks) % 3 === 2){
      const pairIdx = ranks.indexOf(2)
      if (pairIdx === -1) return []
      const pairGroup = new MobileGroup(MobileGroupType.Pair, [RANKS[pairIdx] + suit])
      res.push(pairGroup)
      ranks[pairIdx] -= 2
    }
    res.push(...exhaustHonour(ranks))
    if (res.length === 0) return []
    return [res]
  } else {
    if (suitLen(ranks) % 3 === 2){
      const pairsRes: MobileGroup[][] = []
      for (let i = 0; i < ranks.length; i++) {
        if (ranks[i] >= 2) {
          const suitReducedPair = [...ranks]
          suitReducedPair[i] -= 2
          const res: MobileGroup[][] = exhaust(suitReducedPair)
          
          const pairGroup = new MobileGroup(MobileGroupType.Pair, [RANKS[i] + suit])

          if (res.length > 0) {
            res.forEach(r => r.push(pairGroup))
            pairsRes.push(...res)
          }
        }
      }
      if (pairsRes.length === 0) return []
      return pairsRes
    } else {
      const res: MobileGroup[][] = exhaust(ranks)
      if(res.length === 0) return []
      return res.filter(r => r.length > 0)
    }
  }
}

const exhaustHonour = (ranks: number[]): MobileGroup[] => {
  const res: MobileGroup[] = []
  for (let i = 0; i < ranks.length; i++) {
    if (ranks[i] % 3 !== 0) return []
    if (ranks[i] === 3) {
      const honourTripplet = new MobileGroup(MobileGroupType.Triplet, [RANKS[i] + suit])
      res.push(honourTripplet)
    }
  }
  return res
}

const exhaust = (ranks: number[], i = 0): MobileGroup[][] => {
  if (ranks.length === 0) return [[]]
  const res: MobileGroup[][] = []
  const originalRes = exhaustSequences(ranks)
  if (originalRes !== null) {
    res.push(originalRes)
  }
  while (i < ranks.length) {
    if (ranks[i] >= 3) {
      const residual = [...ranks]
      residual[i] -= 3
      const trippletGroup: MobileGroup = new MobileGroup(MobileGroupType.Triplet, [RANKS[i] + suit])
      const removeTrippletRes = exhaust(residual, i + 1)
      if (removeTrippletRes !== null) {
        removeTrippletRes.forEach(r => r.push(trippletGroup))
        res.push(...removeTrippletRes)
      }
    }
    i++
  }
  return res
}

const exhaustSequences = (r: number[]): MobileGroup[] | null => {
  const ranks = [...r]
  const groups: MobileGroup[] = []
  let i = 0
  while(i < ranks.length - 2) {
    if (ranks[i] === 0) {
      i++
      continue
    }
    if (ranks[i + 1] === 0 || ranks[i + 2] === 0) return null
    groups.push(new MobileGroup(
      MobileGroupType.Sequence, 
      [RANKS[i] + suit, RANKS[i + 1] + suit, RANKS[i + 2] + suit])
    )
    ranks[i]--
    ranks[i + 1]--
    ranks[i + 2]--
  }
  return groups
}

const suitLen = (ranks: number[]) => {
  return ranks.reduce((a, b) => a + b, 0)
}