import { Tile, Call } from "./hand.ts";
import { Query } from "./query.ts";
import { SuitSolution, searchSuitPatterns, MobileGroup, MobileGroupType } from "./suitSearch.ts";
import { TERMINALS, SUITS, CallType, GroupType } from "./constants.ts";


interface IGroup {
  groupType: GroupType
  tiles: Tile[]
}

class Group implements IGroup {
  groupType: GroupType
  tiles: Tile[]
  constructor(groupType: GroupType = GroupType.UNSET, tiles: Tile[] = []){
    this.groupType = groupType
    this.tiles = tiles
  }
  setGroupType(groupType: GroupType) {
    this.groupType = groupType
  }
  setTiles(tiles: Tile[]) {
    this.tiles = tiles
  }
  static isConcealed(group: Group) {
    return [GroupType.Csequence, GroupType.Ctriplet, GroupType.Pair, GroupType.Kokushi].includes(group.groupType)
  }
  static isSequence(group: Group) {
    return [GroupType.Csequence, GroupType.Sequence].includes(group.groupType)
  } 
  static isTriplet(group: Group) {
    return [GroupType.Triplet, GroupType.Ctriplet, GroupType.Kan, GroupType.Ckan].includes(group.groupType)
  }
  static isKan(group: Group) {
    return [GroupType.Kan, GroupType.Ckan].includes(group.groupType)
  }
}

const pattern13Terminals = (query: Query): Group[][] => {
  // check if the Query can win with 13 terminals
  const mobileTiles = query.mobileTiles()
  if (mobileTiles.length !== 14) return []
  for (let terminal of TERMINALS) {
    if (mobileTiles.find(tile => tile.tileStr === terminal) === undefined) {
      return []
    }
  }
  const group = new Group(GroupType.Kokushi, mobileTiles)
  return [[group]]
}

const pattern7pairs = (query: Query): Group[][] => {
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
  return [groups]
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

const patternStandard = (query: Query): Group[][] => {
  let mobileTiles = query.mobileTiles()
  if (mobileTiles.length + query.calls.length * 3 !== 14) return []
  const mTilesBySuits: number[][] = SUITS.map(suit => {
    const tileOfSuit = mobileTiles.filter(tile => tile.suit === suit)
    let arr = new Array(suit === 'z' ? 7 : 9).fill(0)
    tileOfSuit.forEach(tile => {
      const idx = Number(tile.rank) - 1
      arr[idx] += 1
    })
    return arr
  })

  // All possible decomposition of the mobile tiles in TileCount[][] format
  const mobileGroupsRes: MobileGroup[][] = cartesian(
    searchSuitPatterns(mTilesBySuits[0], 'm'),
    searchSuitPatterns(mTilesBySuits[1], 'p'),
    searchSuitPatterns(mTilesBySuits[2], 's'),
    searchSuitPatterns(mTilesBySuits[3], 'z'),
  ).map(suitSolutions => suitSolutions.flatMap(
    (suitSolution: SuitSolution) => suitSolution.groups
  ))

  // exhaust patterns with awareness on winning tile and calls
  let patterns: Group[][] = []

  const settleMobileGroup = (mg: MobileGroup, closed: boolean = true): Group => {
    let group = new Group()

    switch (mg.type) {
      case MobileGroupType.Pair:
        group.setTiles([new Tile(mg.tileNames[0]), new Tile(mg.tileNames[0])])
        group.setGroupType(GroupType.Pair)
        break
      case MobileGroupType.Triplet:
        group.setTiles([new Tile(mg.tileNames[0]), new Tile(mg.tileNames[0]), new Tile(mg.tileNames[0])])
        group.setGroupType(closed ? GroupType.Ctriplet : GroupType.Triplet)
        break
      case MobileGroupType.Sequence:
        group.setTiles([new Tile(mg.tileNames[0]), new Tile(mg.tileNames[1]), new Tile(mg.tileNames[2])])
        group.setGroupType(closed ? GroupType.Csequence : GroupType.Sequence)
    }

    return group
  }

  const settleCall = (call: Call): Group => {
    let group = new Group()
    group.setTiles(call.tiles)

    switch (call.callType) {
      case CallType.Chii:
        group.setGroupType(GroupType.Sequence)
        break
      case CallType.Pon:
        group.setGroupType(GroupType.Triplet)
        break
      case CallType.Kan:
        group.setGroupType(GroupType.Kan)
        break
      case CallType.Ckan:
        group.setGroupType(GroupType.Ckan)
        break
    }
    
    return group
  }

  const allSol = mobileGroupsRes.flatMap((res: MobileGroup[]) => {
    let shapes: Group[][] = []

    const groupsWithWinTile = res.filter(g => g.tileNames.includes(query.winTile.tileStr))
    const groupsWithoutWinTile = res.filter(g => !g.tileNames.includes(query.winTile.tileStr))

    for (let i = 0; i < groupsWithWinTile.length; i++) {
      let shape: Group[] = []
      shape.push(settleMobileGroup(groupsWithWinTile[i], query.isTsumo))
      for (let j = 0; j < groupsWithWinTile.length; j++) {
        if (i === j) continue
        shape.push(settleMobileGroup(groupsWithWinTile[j], true))
      }
      
      groupsWithoutWinTile.forEach(g => {
        shape.push(settleMobileGroup(g, true))
      })
      query.calls.forEach(call => {
        shape.push(settleCall(call))
      })
      
      shapes.push(shape)
    }

    return shapes
  })

  return allSol
}

const patternAll = (query: Query): Group[][] => {
  return [pattern13Terminals, pattern7pairs, patternStandard].flatMap(func => func(query))
}

export {
  pattern13Terminals,
  pattern7pairs,
  patternStandard,
  patternAll,
  Group,
  GroupType
}