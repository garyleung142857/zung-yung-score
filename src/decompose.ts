import { Query, Tile, Call } from "./hand.ts";

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
  if (query.hand.length !== 13) return []
  const wholeHand = query.mobileTiles()
  const terminals = [
    '1m', '9m', '1p', '9p', '1s', '9s', '1z', '2z', '3z', '4z', '5z', '6z', '7z'
  ]
  const cnts = terminals.map(tileStr => wholeHand.filter(tile => tile.tileStr === tileStr).length)
  if (Math.min(...cnts) === 0) return []
  const group = new Group(GroupType.Kokushi, wholeHand)
  return [new Shape([group])]
}

export {pattern13Terminals}