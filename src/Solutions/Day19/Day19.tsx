import {Solution} from '../Utils/Types.ts'
import DayWith from '../Utils/DayUtil.tsx'

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

const matchableMap = new Map<string, boolean>()

function match(towel: Towel, patterns: Pattern[]): boolean {
  if (matchableMap.has(towel)) {
    return matchableMap.get(towel)!!
  }
  else if (towel.length === 0) {
    return true
  }
  else {
    const matchingStarts = patterns.filter(pattern => towel.startsWith(pattern))
    if (matchingStarts.length > 0) {
      const continuedMatch =
        matchingStarts.some(pattern => match(towel.slice(pattern.length), patterns))
      if (continuedMatch) {
        matchableMap.set(towel, true)
        return continuedMatch
      } else {
        matchableMap.set(towel, false)
        return false
      }
    }
    else {
      matchableMap.set(towel, false)
      return false
    }
  }
}

function solve(input: PuzzleInput): Solution<bigint> {

  const matchableTowels = input.towels.filter(towel => match(towel, input.patterns))
  return {
    part1: BigInt(matchableTowels.length),
    part2: BigInt(0)
  }
}

function Day19() {
  return DayWith('19', parse, solve)
}

export default Day19
