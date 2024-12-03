import DayWith from "../Utils/DayUtil.tsx";
import {sum} from "../Utils/MathUtil.ts";

const multiplicationRegExp = /mul\((\d+),(\d+)\)/g

function Day03() {

  type Multiplication = {
    first: bigint,
    second: bigint
  }

  type PuzzleInput = {
    multiplications: Multiplication[]
  }


  function parseInput(puzzleInput: string): PuzzleInput {
    const oneLine = puzzleInput.replace("\n", "")
    const matches = oneLine.matchAll(multiplicationRegExp)

    const multiplications =
      Array.from(matches)
        .map((match) => {
          return {
            first: BigInt(match[1]),
            second: BigInt(match[2])
          }
        })


    return {multiplications: multiplications}
  }

  function solvePart1(puzzleInput: PuzzleInput): bigint {
    const result =
      sum(puzzleInput.multiplications
        .map((multiplication) => multiplication.first * multiplication.second))
    return result
  }

  function solvePart2(puzzleInput: PuzzleInput): bigint {
    return BigInt(0)
  }

  return DayWith(
    "03",
    parseInput,
    solvePart1,
    solvePart2
  )

}

export default Day03
