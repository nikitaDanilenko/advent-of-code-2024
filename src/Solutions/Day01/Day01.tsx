import {absBigInt, sum} from "../Utils/MathUtil"
import lodash from "lodash"
import DayWith from "../Utils/DayUtil.tsx"
import solutionFrom, {Pair} from "../Utils/Types.ts"

function Day01() {

  type PuzzleInput = {
    firstList: bigint[],
    secondList: bigint[]
  }

  function parseInput(puzzleInput: string): PuzzleInput {
    const pairs = puzzleInput
      .split("\n")
      .filter((line) => line !== "")
      .map((line) => {
        const words = line.split("   ").map((word) => BigInt(word))

        return words.length >= 2 ? {first: words[0], second: words[1]} : null
      })
      .filter((pair) => pair !== null)

    function sort(f: (pair: Pair<bigint, bigint>) => bigint): bigint[] {
      return pairs.map(f).sort((a, b) => Number(a - b))
    }

    const firsts = sort((pair) => pair.first)
    const seconds = sort((pair) => pair.second)

    return {firstList: firsts, secondList: seconds}
  }

  function solvePart1(puzzleInput: PuzzleInput): bigint {
    const result =
      sum(
        lodash
          .zipWith(puzzleInput.firstList, puzzleInput.secondList, (x, y) => ({first: x, second: y}))
          .map((pair) => absBigInt(pair.first - pair.second))
      )

    return result
  }

  function solvePart2(puzzleInput: PuzzleInput): bigint {

    const o: Map<string, number> = new Map(
      Object.entries(lodash.groupBy(puzzleInput.secondList, (value) => value))
        .map(([key, value]) => [key, value.length])
    )

    const result =
      sum(puzzleInput
        .firstList
        .map((value) => {
          const inSecond = o.get(value.toString()) || 0
          return value * BigInt(inSecond)
        }))

    return result
  }

  return DayWith<PuzzleInput>(
    "01",
    parseInput,
    solutionFrom(
      solvePart1,
      solvePart2
    )
  )
}

export default Day01
