import { Solution } from '../Utils/Types.ts'
import DayWith from '../Utils/DayUtil.tsx'
import lodash from 'lodash'
import { applyN, sum } from '../Utils/MathUtil.ts'

type Stone = bigint

type PuzzleInput = Stone[]

function parse(input: string): PuzzleInput {
  return input
    .split('\n')
    .filter(line => line.length > 0)[0]
    .split(' ')
    .map(word => BigInt(word))
}

// Not very pretty: One could double down on BigInt for the length part, but the indirection via string works fine.
function next(stone: Stone): Stone[] {
  if (stone === BigInt(0)) {
    return [BigInt(1)]
  } else {
    const stoneString = stone.toString()
    const length = stoneString.length
    if (length % 2 === 0) {
      const half = length / 2
      return [
        BigInt(stoneString.slice(0, half)),
        BigInt(stoneString.slice(half))
      ]
    } else {
      return [stone * BigInt(2024)]
    }
  }
}

type Amounts = [string, number][]

function computeViaAmount(iterations: number, stones: Stone[]): Amounts {
  function blink(amounts: Amounts): Amounts {
    const nextMap = new Map(amounts)
    /* 1. Mutable implementation, because maps are most easily modified in this fashion.
       2. The map is copied
       3. The amount of stones in the result map is decreased by the current amount of stones.
          It may seem like it's always setting to 0, but that is not true.
          For example, say the stones are "11 1". Then the initial amount of 1s is 1.
          Now we process the stone 11.
          This leads to the number of 1s being 3.
          Next we see the stone 1. The original amount is 1, but the current amount is 3.
       4. In every iteration we thus reduce the amount of the currently processed stone by the original amount,
          and increase the amounts of all result stones (at least 1, at most 2) by the original amount.
     */
    amounts.forEach(([stone, amount]) => {
      const nextStones = next(BigInt(stone)).map(stone => stone.toString())
      const currentAmount = nextMap.get(stone) ?? 0
      if (amount > 0) nextMap.set(stone, currentAmount - amount)
      nextStones.forEach(nextStone => {
        const currentAmount = nextMap.get(nextStone) ?? 0
        nextMap.set(nextStone, currentAmount + amount)
      })
    })
    return Array.from(nextMap.entries())
  }

  const amountMap = stones.map(
    stone => [stone.toString(), 1] as [string, number]
  )

  // The "+1" is necessary, because applyN is 0-based, i.e. the first element is the unmodified input.
  return lodash.last(applyN(iterations + 1, blink, amountMap))!!
}

function solve(input: PuzzleInput): Solution<bigint> {
  function withNIterations(n: number): bigint {
    return sum(computeViaAmount(n, input).map(([, number]) => BigInt(number)))
  }

  const stones = withNIterations(25)
  const stones2 = withNIterations(75)

  return {
    part1: stones,
    part2: stones2
  }
}

function Day11() {
  return DayWith('11', parse, solve)
}

export default Day11
