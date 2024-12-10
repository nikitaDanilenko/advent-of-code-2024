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
    /* Explanation:
       First, with spaces. Imagine the disk array 0..111....22222
       Now, go through it from left to right, and match it to its reversed array.

       0..111....22222
       22222....111..0

       The first position is filled, hence we take it directly, i.e.

       intermediate result: 0
       ..111....22222
       22222....111.. <- note that we can drop the last position, because it cannot fit anymore.

       Now, we have two empty positions, and can take the two 2s in succession:

       intermediate result: 022
       111....22222
       222....111..

       Now, again, the leftmost positions are filled, and we can take them directly:

       intermediate result: 022111
       ....2222
       222....1

       Again, we have two empty positions, and can take the three 2s in succession:

       intermediate result: 02211222

       We now have as many cells as we need, and can stop.

       Now notice that empty spaces in the right array are irrelevant, hence we can skip them.
       Also, we do not need to do file part on its own, but rather can take whole blocks of numbers.
       This may not seem like much, but since the blocks can be up to 9 numbers long,
       assuming uniform distribution, using blocks we only have about 1/5th of all the iterations,
       because blocks are about 5 cells long, and we handle all cells of a block at once.
     */
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
