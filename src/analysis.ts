import { Yaku, evaluateQueryShape } from './yaku'
import { Group } from './decompose'
import { Query } from './query'

enum YakusStatus {
  UNSET = 0,
  CHICKEN_HAND = 1,
  SMALL_HAND = 2,
  BIG_HAND = 3,
  COMPOUND_LIMIT = 4,
  LISTED_LIMIT = 5
}

const CHICKEN_HAND_SCORE = 1
const LIMIT_THRESHOLD = 320
const BIG_HAND_THRESHOLD = 25

class Analysis {
  score: number = 0
  groups: Group[] = []
  yakus: Yaku[] = []
  effectiveYakus: Yaku[] = []
  status: YakusStatus = YakusStatus.UNSET
  isTsumo: boolean = false
  constructor(q: Query, shape: Group[]) {
    this.groups = shape
    this.isTsumo = q.isTsumo
    this.yakus = evaluateQueryShape(q, this.groups).sort((a, b) => a.cat > b.cat ? 1 : -1)
    if (this.yakus.length === 0) {
      this.score = CHICKEN_HAND_SCORE
      this.status = YakusStatus.CHICKEN_HAND
      return
    }

    const rawScore: number = this.yakus.reduce((a, b) => a + b.score, 0)
    if (rawScore < LIMIT_THRESHOLD) {
      this.score = rawScore
      this.effectiveYakus = this.yakus
      this.status = rawScore <= BIG_HAND_THRESHOLD ? YakusStatus.SMALL_HAND : YakusStatus.BIG_HAND
      return
    }

    const limitYakus = this.yakus.filter(yaku => yaku.score >= LIMIT_THRESHOLD).sort((a, b) => {
      if (a.score === b.score) return a.cat > b.cat ? 1 : -1
      return b.score - a.score
    })
    
    if (limitYakus.length === 0) {
      this.score = LIMIT_THRESHOLD
      this.effectiveYakus = this.yakus
      this.status = YakusStatus.COMPOUND_LIMIT
      return
    } else {
      this.score = limitYakus[0].score
      this.effectiveYakus = limitYakus.slice(0, 1)
      this.status = YakusStatus.LISTED_LIMIT
    }
  }

  payment(tsumo: boolean): number[] {
    if(tsumo || [YakusStatus.CHICKEN_HAND, YakusStatus.SMALL_HAND].includes(this.status)) {
      return [-this.score, -this.score, -this.score, 3 * this.score]
    }
    return [
      -BIG_HAND_THRESHOLD, 
      -BIG_HAND_THRESHOLD, 
      2 * BIG_HAND_THRESHOLD - 3 * this.score,
      3 * this.score
    ]
  }

  get yakusStr(): string {
    return this.effectiveYakus.map(yaku => yaku.cat).join('|')
  }

  get analysis(): any {
    return {
      groups: this.groups,
      str: this.yakusStr,
      effectiveYakus: this.effectiveYakus,
      score: {baseScore: this.score, payment: this.payment(this.isTsumo)}
    }
  }
}

export {
  Analysis
}