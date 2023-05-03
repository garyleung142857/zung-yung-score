import { Query, Tile, Call } from "./hand.ts";
import { searchSuitPatterns } from "./suitSearch.ts";


const TERMINALS19 = [
  new Tile('1m'), new Tile('9m'), new Tile('1p'), new Tile('9p'), new Tile('1s'), new Tile('9s')
]

const HONORS = [
  new Tile('1z'), new Tile('2z'), new Tile('3z'), new Tile('4z'), new Tile('5z'), new Tile('6z'), new Tile('7z')
]

const TERMINALS = [...TERMINALS19, ...HONORS]

enum GroupType {
  UNSET = 0,
  Sequence = 3,
  Triplet = 4,
  Kan = 5,
  Ckan = 6,
  Csequence = 7, // concealed sequence
  Ctriplet = 8, // concealed triplet
  Pair = 9,
  Kokushi = 10
}

interface IGroup {
  groupType: GroupType
  tiles: Tile[]
  isConcealed: () => boolean
  isTriplet: () => boolean
  isKan: () => boolean
}

class Shape {
  groups: Group[]
  constructor(groups: Group[]){
    this.groups = groups
  }
}

class Group implements IGroup {
  groupType: GroupType
  tiles: Tile[]
  constructor(groupType: GroupType, tiles: Tile[]){
    this.groupType = groupType
    this.tiles = tiles
  }
  isConcealed() {
    return [GroupType.Csequence, GroupType.Ctriplet, GroupType.Pair, GroupType.Kokushi].includes(this.groupType)
  }
  isTriplet() {
    return [GroupType.Triplet, GroupType.Ctriplet, GroupType.Kan, GroupType.Ckan].includes(this.groupType)
  }
  isKan() {
    return [GroupType.Kan, GroupType.Ckan].includes(this.groupType)
  }
}

const pattern13Terminals = (query: Query): Shape[] => {
  // check if the Query can win with 13 terminals
  const mobileTiles = query.mobileTiles()
  if (mobileTiles.length !== 14) return []
  for (let terminal of TERMINALS) {
    if (mobileTiles.find(tile => tile.equals(terminal)) === undefined) {
      return []
    }
  }
  const group = new Group(GroupType.Kokushi, mobileTiles)
  return [new Shape([group])]
}

const pattern7pairs = (query: Query): Shape[] => {
  let mobileTiles = query.mobileTiles()
  if (mobileTiles.length !== 14) return []
  let groups = []
  while (mobileTiles.length > 0) {
    const t = mobileTiles.pop()
    const idx = mobileTiles.findIndex(tile => tile.equals(t!))
    if (idx === -1) return []
    groups.push(new Group(GroupType.Pair, [t!, t!]))
    mobileTiles.splice(idx, 1)
  }
  return [new Shape(groups)]
}

function cartesian(...args: any) {
  let r: any[] = []
  let max = args.length - 1
  function helper(arr: any[], i: number) {
    for (let j = 0, l = args[i].length; j < l; j++) {
      var a = arr.slice(0); // clone arr
      a.push(args[i][j])
      if (i === max) r.push(a);
      else helper(a, i + 1)
    }
  }
  helper([], 0);
  return r
}

const patternStandard = (query: Query): Shape[] => {
  let mobileTiles = query.mobileTiles()
  if (mobileTiles.length + query.calls.length * 3 !== 14) return []
  const mTilesBySuits: number[][] = ['m', 'p', 's', 'z'].map(suit => {
    const tileOfSuit = mobileTiles.filter(tile => tile.suit === suit)
    let arr = new Array(suit === 'z' ? 7 : 9).fill(0)
    tileOfSuit.forEach(tile => {
      const idx = Number(tile.rank) - 1
      arr[idx] += 1
    })
    return arr
  })

  const searchResBySuits = [
    searchSuitPatterns(mTilesBySuits[0], false),
    searchSuitPatterns(mTilesBySuits[1], false),
    searchSuitPatterns(mTilesBySuits[2], false),
    searchSuitPatterns(mTilesBySuits[3], true),
  ]

  console.log(cartesian(...searchResBySuits))

  return []
}


export {
  pattern13Terminals,
  pattern7pairs,
  patternStandard
}