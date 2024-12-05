import DayWith from "../Utils/DayUtil.tsx";
import lodash from "lodash";
import {Solution} from "../Utils/Types.ts";

function Day05() {
  type Smaller = {
    left: number,
    right: number
  }

  type Update = {
    numbers: number[]
  }

  type PuzzleInput = {
    // Comparisons are stored as JSON strings to allow for easy and fast (!) comparison
    comparisons: string[],
    updates: Update[]
  }

  function parseInput(input: string): PuzzleInput {
    const [comparisonString, updateString] = input.split('\n\n')
    const comparisons = comparisonString
      .split('\n')
      .map(comparison => {
        const [left, right] = comparison.split('|')
        return JSON.stringify({left: parseInt(left), right: parseInt(right)})
      })
    const updates = updateString
      .split('\n')
      .filter(s => s !== '')
      .map(update => {
        return {numbers: update.split(',').map(num => parseInt(num))}
      })

    return {comparisons: comparisons, updates: updates}
  }

  function isSmaller(smaller: Smaller, comparisons: string[]): boolean {
    return lodash.find(comparisons, s => s === JSON.stringify(smaller)) !== undefined
  }

  function checkUpdate(inputComparisons: string[], update: Update): boolean {
    const comparisons = lodash.zipWith(
      lodash.initial(update.numbers),
      lodash.tail(update.numbers),
      (left, right) => ({left: left, right: right})
    )
    return lodash.every(
      comparisons,
      (comparison) => isSmaller(comparison, inputComparisons)
    )
  }

  function middleElement(numbers: number[]): number {
    return numbers[(numbers.length - 1) / 2]
  }

  function solve(input: PuzzleInput): Solution<bigint> {
    const [valid, invalid] = lodash.partition(input.updates, update => checkUpdate(input.comparisons, update))

    const part1 = BigInt(lodash.sum(valid.map(update => middleElement(update.numbers))))

    function bubbleOnce(numbers: number[]): number[] {
      if (numbers.length <= 1) {
        return numbers
      } else {
        const [left, right, ...rest] = numbers
        if (isSmaller({left: left, right: right}, input.comparisons)) {
          return [left].concat(bubbleOnce([right, ...rest]))
        } else {
          return [right].concat(bubbleOnce([left, ...rest]))
        }
      }
    }


    function bubbleSort(numbers: number[]): number[] {
      const range = lodash.range(0, numbers.length)
      return lodash.reduce(
        range,
        (acc, i) => {
          const front = lodash.take(acc, numbers.length - i)
          const back = lodash.takeRight(acc, i)
          return bubbleOnce(front).concat(back)
        },
        numbers
      )
    }

    /* The computation takes a very noticeable amount of time.
       There are around 100 sort operations, which all take on the order of around 10ms,
       which adds up to around 1s.
       Actually, both numbers are slightly higher, but the order of magnitude is correct.
       A different sorting algorithm may perform better, but BubbleSort is particularly simple to implement.
     */
    const part2 = BigInt(
      lodash.sum(invalid.map(update => middleElement(bubbleSort(update.numbers))))
    )

    return {
      part1: part1,
      part2: part2
    }

  }

  return DayWith(
    "05",
    parseInput,
    solve
  )
}

export default Day05
