import {parsePosition2d, Position2d, Solution} from '../Utils/Types.ts'
import DayWith from '../Utils/DayUtil.tsx'
import {parseStringPositionMap, parseStringPositionTypedMap, StringPosition} from "../Utils/InputUtil.ts";

type PuzzleInput = {
  positions: Position2d[]
}

type ElementMap = Map<StringPosition, Element>

enum Element  {
  Empty = '.',
  Byte = '#'
}

function parse(input: string): PuzzleInput {
  return {
    positions: input.split('\n').map(parsePosition2d)
  }
}

function solve(input: PuzzleInput): Solution<bigint> {
  console.log(input)
  return {
    part1: BigInt(0),
    part2: BigInt(0)
  }
}

function Day18() {
  return DayWith('18', parse, solve)
}

export default Day18
