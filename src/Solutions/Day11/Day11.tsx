import {Solution} from "../Utils/Types.ts";
import DayWith from "../Utils/DayUtil.tsx";
import lodash from "lodash";

type Stone = bigint

type PuzzleInput = Stone[]

function parse(input: string): PuzzleInput {
  return input
    .split('\n')
    .filter(line => line.length > 0)[0]
    .split(' ')
    .map((word) => BigInt(word))
}

function next(stone: Stone): Stone[] {
  if (stone === BigInt(0)) {
    return [BigInt(1)]
  }
  else {
    const stoneString = stone.toString()
    const length = stoneString.length
    if (length % 2 === 0) {
      const half = length / 2
      return [BigInt(stoneString.slice(0, half)), BigInt(stoneString.slice(half))]
    }
    else {
      return [stone * BigInt(2024)]
    }
  }
}

function iterateNext(iterations: number, stones: Stone[]): Stone[] {
  return lodash.range(iterations).reduce((acc, _) => {
    console.log(acc)
    return acc.flatMap(next)
  }, stones)
}

function solve(input: PuzzleInput): Solution<bigint> {
  const stones = iterateNext(25, input).length

  const stones2 = BigInt(0)

  return {
    part1: BigInt(stones),
    part2: BigInt(stones2),
  }
}

function Day11() {
  return DayWith(
    "11",
    parse,
    solve
  )
}

export default Day11
