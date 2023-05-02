import { Query, Tile, Call } from "./src/hand";
import { pattern13Terminals } from "./src/decompose";

const query = new Query(
  1,
  [
    '1m', '9m', '1p', '9p', '1s', '9s', '1z', '2z', '3z', '4z', '5z', '6z', '7z'
  ],
  [new Call(1, ['1s'])],
  []
)


console.log(pattern13Terminals(query))
