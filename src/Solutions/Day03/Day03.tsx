import DayWith from "../Utils/DayUtil.tsx"
import { sum } from "../Utils/MathUtil.ts"
import { takeUntilRemainderStartsWith } from "../Utils/CollectionUtil.ts"
import solutionFrom from "../Utils/Types.ts"

const multiplicationRegExp = /mul\((\d+),(\d+)\)/g

function Day03() {
  type Multiplication = {
    first: bigint
    second: bigint
  }

  type PuzzleInput = {
    multiplications: Multiplication[][]
  }

  function parseInput(input: string): PuzzleInput {
    const oneLine = input.replace("\n", "")

    function iterateChunks(
      fragment1: string,
      fragment2: string,
      remainder: string,
      relevantBlocks: string[],
    ): [string, string[]] {
      if (remainder === "") {
        return ["", relevantBlocks]
      } else {
        const [nextChunk, nextRemainder] = takeUntilRemainderStartsWith(
          fragment1,
          remainder,
        )
        return iterateChunks(fragment2, fragment1, nextRemainder, [
          ...relevantBlocks,
          nextChunk,
        ])
      }
    }

    const [_, relevantBlocks] = iterateChunks("don't()", "do()", oneLine, [])

    const multiplications = relevantBlocks.map((block) => {
      return Array.from(block.matchAll(multiplicationRegExp)).map((match) => {
        return {
          first: BigInt(match[1]),
          second: BigInt(match[2]),
        }
      })
    })

    return { multiplications: multiplications }
  }

  function sumOfMultiplications(multiplications: Multiplication[]): bigint {
    return sum(
      multiplications.map(
        (multiplication) => multiplication.first * multiplication.second,
      ),
    )
  }

  function solvePart1(puzzleInput: PuzzleInput): bigint {
    // For the first part, all occurrences are fine.
    return sumOfMultiplications(puzzleInput.multiplications.flat())
  }

  function solvePart2(puzzleInput: PuzzleInput): bigint {
    // For the second part only the even occurrences are relevant, because every odd occurrence starts with 'don't()'.
    return sumOfMultiplications(
      puzzleInput.multiplications.filter((_, index) => index % 2 === 0).flat(),
    )
  }

  return DayWith("03", parseInput, solutionFrom(solvePart1, solvePart2))
}

export default Day03
