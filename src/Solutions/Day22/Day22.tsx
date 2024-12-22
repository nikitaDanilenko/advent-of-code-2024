import { Solution } from '../Utils/Types.ts'
import DayWith from '../Utils/DayUtil.tsx'
import { applyN, applyNOnlyLast, sum } from '../Utils/MathUtil.ts'
import lodash from 'lodash'

type PuzzleInput = bigint[]

function parse(input: string): PuzzleInput {
  return input
    .split('\n')
    .filter(l => l.length > 0)
    .map(BigInt)
}

function mix(secret: bigint, value: bigint): bigint {
  return value ^ secret
}

const magicConstant = 16777216n // two to the 14th power

function prune(value: bigint): bigint {
  return value % magicConstant
}

function next(secret: bigint): bigint {
  const step1 = prune(mix(secret, secret * 64n))
  const step2 = prune(mix(step1, step1 / 32n))
  const step3 = prune(mix(step2, step2 * 2048n))
  return step3
}

function twoK(initial: bigint): bigint {
  return applyNOnlyLast(2000, next, initial)
}

function firstTwoK(initial: bigint): bigint[] {
  return applyN(2001, next, initial)
}

function sumOfTwoKs(initials: bigint[]): bigint {
  return sum(initials.map(twoK))
}

function fourDiffMap(numbers: bigint[]): Map<string, bigint> {
  const map = new Map<string, bigint>()
  for (let i = 0; i < numbers.length - 5; i++) {
    const prices = numbers.slice(i, i + 5)
    const differences = lodash.zipWith(
      lodash.initial(prices),
      lodash.tail(prices),
      (a, b) => b - a
    )

    const key = differences.join(',')
    const value = lodash.last(prices)!
    if (!map.has(key))
      map.set(key, value)
  }
  return map
}

function addMaps(map1: Map<string, bigint>, map2: Map<string, bigint>): Map<string, bigint> {
  const result = new Map(map1)
  Array.from(map2.entries()).forEach(([key, value]) => {
    result.set(key, (result.get(key) ?? BigInt(0)) + value)
  })

  return result
}

function maxPrice(input: PuzzleInput): bigint {
  const result =
    input.reduce(
      (map, number) => {
        const prices = firstTwoK(number).map(n => n % 10n)
        const diffMap = fourDiffMap(prices)
        return addMaps(map, diffMap)
      },
      new Map<string, bigint>()
    )

  return lodash.max(Array.from(result.values()))!
}

function solve(input: PuzzleInput): Solution<bigint> {
  const part1 = sumOfTwoKs(input)
  const part2 = maxPrice(input)

  return {
    part1: part1,
    part2: part2
  }
}

function Day22() {
  return DayWith('22', parse, solve)
}

export default Day22
