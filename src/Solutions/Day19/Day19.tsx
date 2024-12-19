import {Solution} from '../Utils/Types.ts'
import DayWith from '../Utils/DayUtil.tsx'
import * as string_decoder from "node:string_decoder";

type PuzzleInput = {
  patterns: Pattern[]
  towels: Towel[]
}

type Pattern = string
type Towel = string

function parse(input: string): PuzzleInput {
  const [patternString, towelString] = input.split('\n\n')
  const patterns = patternString.split(', ')
  const towels = towelString.split('\n')
  return {
    patterns: patterns,
    towels: towels
  }
}

function solve(input: PuzzleInput): Solution<bigint> {
  console.log(input)
  return {
    part1: BigInt(0),
    part2: BigInt(0)
  }
}

function Day19() {
  return DayWith('19', parse, solve)
}

export default Day19
