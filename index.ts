import { Query, Tile, Call } from "./src/hand";
import { pattern13Terminals, pattern7pairs, patternStandard, patternAll } from "./src/decompose";
import { searchSuitPatterns } from "./src/suitSearch"
import { CallType } from "./src/constants";

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


const query4 = new Query({
  hand: [
    '2s', '2s', '3s', '3s', '4s', '4s', '5s'
  ],
  winTile: new Tile('5s'),
  calls: [new Call(CallType.Ckan, ['1z', '1z', '1z', '1z']), new Call(CallType.Chii, ['5s', '6s', '7s'])]
})

const query5 = new Query({
  hand: [
    '2s', '2s', '3s', '3s', '4s', '4s', '5s', '7p', '7p', '8p', '8p', '9p', '9p'
  ],
  winTile: new Tile('5s'),
})

console.log(pattern13Terminals(query).map(shape => shape))
console.log(pattern7pairs(query2).map(shape => shape))

const shapes3 = patternStandard(query3)
shapes3.forEach(s => console.log(s))

const shapes4 = patternStandard(query4)
shapes4.forEach(s => console.log(s))

const shapes5 = patternAll(query5)
shapes5.forEach(s => console.log(s))
