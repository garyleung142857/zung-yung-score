import { Query, Tile, Call } from "./hand.ts";

const TERMINALS19 = [
  new Tile('1m'), new Tile('9m'), new Tile('1p'), new Tile('9p'), new Tile('1s'), new Tile('9s')
]

const HONORS = [
  new Tile('1z'), new Tile('2z'), new Tile('3z'), new Tile('4z'), new Tile('5z'), new Tile('6z'), new Tile('7z')
]

const TERMINALS = [...TERMINALS19, ...HONORS]

enum GroupType {
  Chii = 3,
  Pon = 4,
  Kan = 5,
  Ckan = 6,
  Sequence = 7,
  Triplet = 8,
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
    return [GroupType.Sequence, GroupType.Triplet, GroupType.Pair, GroupType.Kokushi].includes(this.groupType)
  }
  isTriplet() {
    return [GroupType.Pon, GroupType.Kan, GroupType.Ckan].includes(this.groupType)
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


export {
  pattern13Terminals,
  pattern7pairs
}