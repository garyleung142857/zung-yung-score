import { Call } from "./src/call";
import { Query } from "./src/query";
import { CallType } from "./src/constants";

const query = new Query({
  hand: [
    '1m', '9m', '1p', '9p', '1s', '9s', '1z', '2z', '3z', '4z', '5z', '6z', '7z'
  ],
  winTile: '1s',
})

const query2 = new Query({
  hand: [
    '3m', '3m', '5m', '5m', '6m', '6m', '1z', '1z', '6z', '6z', '2z', '2z', '8s'
  ],
  winTile: '8s',
})

const query3 = new Query({
  hand: [
    '1m', '1m', '1m', '2m', '2m', '2m', '3m', '3m', '3m', '7s', '8s', '9s', '9s'
  ],
  winTile: '9s'
})


const query4 = new Query({
  hand: [
    '2s', '2s', '3s', '3s', '4s', '4s', '5s'
  ],
  winTile: '5s',
  calls: [new Call(CallType.Ckan, ['1z', '1z', '1z', '1z']), new Call(CallType.Chii, ['5s', '6s', '7s'])]
})

const query5 = new Query({
  hand: [
    '2s', '2s', '3s', '3s', '4s', '4s', '5s', '7p', '7p', '8p', '8p', '9p', '9p'
  ],
  winTile: '5s',
})

console.log(query.result)
console.log(query2.result)
console.log(query3.result)
console.log(query4.result)
console.log(query5.result)