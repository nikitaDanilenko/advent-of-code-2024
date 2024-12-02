import DayWith from "../Utils/DayUtil.tsx";
import * as _ from "lodash";

function Day02() {

  type Levels = Array<number>

  type PuzzleInput = {
    reports: Array<Levels>
  }

  function parseInput(text: string): PuzzleInput {
    return {
      reports: text
        .split("\n")
        .filter((line) => line !== "")
        .map((line) => {
          return line.split(" ").map((word) => parseInt(word))
        })
    }
  }

  function checkOrder(predicate: (x: number, y: number) => boolean, levels: Levels): boolean {
    return (
      _.every(
        // Extra 'initial', because 'zipWith' does not trim arrays to the shortest length.
        _.zipWith(_.initial(levels), _.tail(levels), (x, y) => ({first: x, second: y})),
        (pair) => predicate(pair.first, pair.second)
      )
    )
  }

  function countWith(predicate: (x: number, y: number) => boolean, puzzleInput: PuzzleInput): number {
    return (puzzleInput.reports.filter((levels) => checkOrder(predicate, levels))).length
  }

  function solvePart1(puzzleInput: PuzzleInput): bigint {
    const ascending = countWith((x, y) => x < y && y - x <= 3, puzzleInput)

    const descending = countWith((x, y) => x > y && x - y <= 3, puzzleInput)
    const result = BigInt(ascending + descending)

    return (result)
  }

  function solvePart2(puzzleInput: PuzzleInput): bigint {
    return BigInt(0)
  }

  return DayWith<PuzzleInput>(
    "02",
    parseInput,
    solvePart1,
    solvePart2
  )

}

export default Day02
