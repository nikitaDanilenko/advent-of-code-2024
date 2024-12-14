import DayWith from "../Utils/DayUtil.tsx"
import { Solution } from "../Utils/Types.ts"
import lodash from "lodash"
import { sum } from "../Utils/MathUtil.ts"

type PuzzleInput = {
  disk: string[]
  original: string
}

function parse(input: string): PuzzleInput {
  const disk = input
    .split("\n")[0]
    .split("")
    .flatMap((x, index) => {
      const number = parseInt(x)
      if (index % 2 === 0) {
        return lodash.fill(Array(number), (index / 2).toString())
      } else {
        return lodash.fill(Array(number), ".")
      }
    })

  return {
    disk: disk,
    original: input
  }
}

const empty: string = "."

// The loop solution may be an artifact from a previous attempt.
// I tried a recursive solution first, but it ran into stack issues, while the loop solution worked fine.
function combineViaLoop(
  leftToRight: string[],
  rightToLeftNonEmpty: string[],
  targetCells: number
): string[] {
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

type Block = {
  index: number | undefined // undefined means empty
  length: number
  start: number
}

function toBlocks(array: string[]): Block[] {
  const [blocks] = array
    .map((x, index) => {
      return {
        length: parseInt(x),
        index: index % 2 === 0 ? index / 2 : undefined
      }
    })
    .reduce(
      ([blocks, currentIndex], { length, index }) => {
        const block = { length: length, index: index, start: currentIndex }
        return [[...blocks, block], currentIndex + length] as [Block[], number]
      },
      [[], 0] as [Block[], number]
    )
  return blocks
}

function solvePart2(input: string): bigint {
  const disk = input.split("")
  const blocks = toBlocks(disk)
  const numberOfFiles = blocks.filter(x => x.index !== undefined).length

  // Call only if the file block already fits into the empty block.
  function place(fileBlock: Block, emptyBlock: Block): Block[] {
    if (fileBlock.length < emptyBlock.length) {
      return [
        {
          index: fileBlock.index,
          length: fileBlock.length,
          start: emptyBlock.start
        },
        {
          index: undefined,
          length: emptyBlock.length - fileBlock.length,
          start: emptyBlock.start + fileBlock.length
        }
      ]
    } else {
      return [{ ...emptyBlock, index: fileBlock.index }]
    }
  }

  // Same story as with the other iteration: Recursion is too deep
  function iterateBlocksViaLoop(disk: Block[]): Block[] {
    /**
     * I had thought about the same approach for the first part, but it felt too complicated because the file would have needed splitting.
     *
     * However, for the second part, the direct approach is actually simpler.
     * We store blocks in their order of appearance.
     * Now for every file from the back we attempt to find the leftmost fitting empty block, i.e. a block, whose length is at least that of the file.
     * The empty block is then split into one or two blocks - the first is always the moved file, and the optional second is the remaining free space.
     * We continue, until we found enough blocks.
     *
     * Quadratic complexity, but still ok-ish.
     */
    let remainingFiles = Array(
      ...disk.filter(x => x.index !== undefined)
    ).reverse()
    let currentNumberOfFiles = 0
    while (currentNumberOfFiles < numberOfFiles) {
      const [nextFile, ...nextRemainingFiles] = remainingFiles
      remainingFiles = nextRemainingFiles
      currentNumberOfFiles++
      // The block needs to be earlier than the file, because otherwise we may move files from the front to the back
      const fittingEmptyBlock = lodash.find(
        disk,
        x =>
          x.index === undefined &&
          x.length >= nextFile.length &&
          x.start <= nextFile.start
      )
      if (fittingEmptyBlock !== undefined) {
        const newArea = place(nextFile, fittingEmptyBlock)
        const indexOfEmptyBlock = lodash.findIndex(
          disk,
          x => x.start === fittingEmptyBlock.start
        )
        const diskWithoutFile = disk.map(x => {
          return x.index === nextFile.index ? { ...x, index: undefined } : x
        })
        disk = [
          ...diskWithoutFile.slice(0, indexOfEmptyBlock),
          ...newArea,
          ...diskWithoutFile.slice(indexOfEmptyBlock + 1)
        ]
      }
    }
    return disk
  }

  const finalDisk = iterateBlocksViaLoop(blocks)
  const part2 = sum(
    finalDisk
      .filter(x => x.index !== undefined)
      .map(x => {
        const range = lodash.range(0, x.length)
        const index = BigInt(x.index!!)
        const subSum = sum(range.map(y => BigInt(x.start + y) * index))
        return subSum
      })
  )

  return part2
}

function solve(input: PuzzleInput): Solution<bigint> {
  const diskArray = input.disk
  const targetCells = diskArray.filter(x => x !== empty).length
  const final = combineViaLoop(
    diskArray,
    Array(...diskArray)
      .filter(x => x !== empty)
      .reverse(),
    targetCells
  )
  const part1 = sum(final.map((x, index) => BigInt(parseInt(x) * index)))

  return {
    part1: part1,
    part2: solvePart2(input.original)
  }
}

function Day09() {
  return DayWith("09", parse, solve)
}

export default Day09
