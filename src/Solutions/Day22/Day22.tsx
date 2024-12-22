import { Solution } from '../Utils/Types.ts'
import DayWith from '../Utils/DayUtil.tsx'
import { applyNOnlyLast, sum } from '../Utils/MathUtil.ts'

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

function sumOfTwoKs(initials: bigint[]): bigint {
  return sum(initials.map(twoK))
}

function solve(input: PuzzleInput): Solution<bigint> {
  const part1 = sumOfTwoKs(input)

  return {
    part1: part1,
    part2: BigInt(0)
  }
}

function Day22() {
  return DayWith('22', parse, solve)
}

export default Day22
