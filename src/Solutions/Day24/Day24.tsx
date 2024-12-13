import {Solution} from "../Utils/Types.ts"
import DayWith from "../Utils/DayUtil.tsx"

type PuzzleInput = string

function parse(input: string): PuzzleInput {
  return input
}

function solve(input: PuzzleInput): Solution<bigint> {
  console.log(input)
  return {
    part1: BigInt(0),
    part2: BigInt(0)
  }
}

function Day24() {
  return DayWith(
    "24",
    parse,
    solve,
  )
}

export default Day24
