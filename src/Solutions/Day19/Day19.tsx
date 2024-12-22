import { Solution } from '../Utils/Types.ts'
import DayWith from '../Utils/DayUtil.tsx'
import lodash from 'lodash'

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

  const matchableMap = new Map<string, number>()

  function match(towel: Towel, patterns: Pattern[]): number {
    if (matchableMap.has(towel)) {
      return matchableMap.get(towel)!
    } else if (towel.length === 0) {
      return 1
    } else {
      const matchingStarts = patterns.filter(pattern => towel.startsWith(pattern))
      if (matchingStarts.length > 0) {
        const continuedMatch = matchingStarts.map(pattern => match(towel.slice(pattern.length), patterns))
        const all = lodash.sum(continuedMatch)
        matchableMap.set(towel, all)
        return all
      } else {
        matchableMap.set(towel, 0)
        return 0
      }
    }
  }

  const matches = input.towels.map(towel => match(towel, input.patterns))
  const matchableTowels = matches.filter(m => m > 0)

  return {
    part1: BigInt(matchableTowels.length),
    part2: BigInt(lodash.sum(matchableTowels))
  }
}

function Day19() {
  return DayWith('19', parse, solve)
}

export default Day19
