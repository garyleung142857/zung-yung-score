import { Query, Tile, Call } from "./src/hand";
import { pattern13Terminals, pattern7pairs, patternStandard } from "./src/decompose";
import { searchSuitPatterns } from "./src/suitSearch"

const query = new Query({
  hand: [
    '1m', '9m', '1p', '9p', '1s', '9s', '1z', '2z', '3z', '4z', '5z', '6z', '7z'
  ],
  winTile: new Tile('1s'),
})

const query2 = new Query({
  hand: [
    '3m', '3m', '5m', '5m', '6m', '6m', '1z', '1z', '6z', '6z', '2z', '2z', '8s'
  ],
  winTile: new Tile('8s'),
})

const query3 = new Query({
  hand: [
    '1m', '1m', '1m', '2m', '2m', '2m', '3m', '3m', '3m', '7s', '8s', '9s', '9s'
  ],
  winTile: new Tile('9s')
})


// let suit = [0, 2, 2, 2, 2, 0, 0, 0, 0]
// let sol = searchSuitPatterns(suit, false)
// sol?.forEach(s => {
//   console.log(s)
// })
// console.log(sol?.length)

// console.log(pattern13Terminals(query).map(shape => shape.groups))
// console.log(pattern7pairs(query2).map(shape => shape.groups))

// console.log(patternStandard(query))
// console.log(patternStandard(query2))

console.log(patternStandard(query3))