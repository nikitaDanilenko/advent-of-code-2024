import DayWith from "../Utils/DayUtil.tsx";
import {Solution} from "../Utils/Types.ts";
import lodash from "lodash";
import {sum} from "../Utils/MathUtil.ts";

type PuzzleInput = {
  disk: string[]
}

function parse(input: string): PuzzleInput {
  const disk = input
    .split('\n')[0]
    .split('')
    .flatMap(((x, index) => {
      const number = parseInt(x)
      if (index % 2 === 0) {
        return lodash.fill(Array(number), (index / 2).toString())
      } else {
        return lodash.fill(Array(number), '.')
      }
    }))

  return {
    disk: disk
  }
}

const empty: string = '.'

// The loop solution may be an artifact from a previous attempt.
// I tried a recursive solution first, but it ran into stack issues, while the loop solution worked fine.
function combineViaLoop(leftToRight: string[], rightToLeftNonEmpty: string[], targetCells: number): string[] {
  const combined = []
  let reachedCells = 0
  while (reachedCells <= targetCells) {
    const nonEmptyLeft = lodash.takeWhile(leftToRight, x => x !== empty)
    if (nonEmptyLeft.length > 0) {
      leftToRight = lodash.drop(leftToRight, nonEmptyLeft.length)
      combined.push(...nonEmptyLeft)
      reachedCells += nonEmptyLeft.length
    } else {
      const emptyLeft = lodash.takeWhile(leftToRight, x => x === empty).length
      const nonEmptyRight = lodash.take(rightToLeftNonEmpty, emptyLeft)
      leftToRight = lodash.drop(leftToRight, emptyLeft)
      rightToLeftNonEmpty = lodash.drop(rightToLeftNonEmpty, emptyLeft)
      combined.push(...nonEmptyRight)
      reachedCells += nonEmptyRight.length
    }
  }
  return lodash.take(combined, targetCells)
}

function solve(input: PuzzleInput): Solution<bigint> {
  const diskArray = input.disk
  const targetCells = diskArray.filter(x => x !== empty).length
  const final = combineViaLoop(diskArray, Array(...diskArray).filter(x => x !== empty).reverse(), targetCells)
  const part1 = sum(final.map(((x, index) => BigInt(parseInt(x) * index))))

  return {
    part1: part1,
    part2: BigInt(0),
  }
}

function Day09() {

  return DayWith(
    "09",
    parse,
    solve
  )
}

export default Day09
