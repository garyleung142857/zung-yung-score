import { Query, Tile, Call } from "./src/hand";
import { pattern13Terminals, pattern7pairs, patternStandard } from "./src/decompose";
import { searchSuitPatterns } from "./src/suitSearch"

const query = new Query(
  1,
  [
    '1m', '9m', '1p', '9p', '1s', '9s', '1z', '2z', '3z', '4z', '5z', '6z', '7z'
  ],
  new Tile('1s'),
  false,
  [],
  []
)

const query2 = new Query(
  1,
  [
    '3m', '3m', '5m', '5m', '6m', '6m', '1z', '1z', '6z', '6z', '2z', '2z', '8s'
  ],
  new Tile('8s'),
  true,
  [],
  []
)

let suit = [0, 0, 4, 4, 4, 2, 0, 0, 0]
let sol = searchSuitPatterns(suit, false)
sol?.forEach(s => {
  console.log(s)
})
console.log(sol?.length)



// console.log(pattern13Terminals(query).map(shape => shape.groups))
// console.log(pattern7pairs(query2).map(shape => shape.groups))

// console.log(patternStandard(query))
// console.log(patternStandard(query2))