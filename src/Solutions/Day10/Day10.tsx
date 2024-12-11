import {parseStringPositionMap, StringPositionMap} from "../Utils/InputUtil.ts";
import {Solution} from "../Utils/Types.ts";
import DayWith from "../Utils/DayUtil.tsx";


type PuzzleInput = {
  map: StringPositionMap
}

function parseInput(input: string): PuzzleInput {
  const map = parseStringPositionMap(input)
  return {map: new Map(map)}
}

function solve(input: PuzzleInput): Solution<bigint> {
  return {
    part1: BigInt(0),
    part2: BigInt(0)
  }
}

function Day10() {
  return DayWith(
    "10",
    parseInput,
    solve
  )
}

export default Day10
