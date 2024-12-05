import DayWith from "../Utils/DayUtil.tsx";
import lodash from "lodash";

function Day05() {
  type Smaller = {
    left: number,
    right: number
  }

  type Update = {
    numbers: number[]
  }

  type PuzzleInput = {
    comparisons: Smaller[],
    updates: Update[]
  }

  function parseInput(input: string): PuzzleInput {
    const [comparisonString, updateString] = input.split('\n\n')
    const comparisons = comparisonString
      .split('\n')
      .map(comparison => {
        const [left, right] = comparison.split('|')
        return {left: parseInt(left), right: parseInt(right)}
      })
    const updates = updateString
      .split('\n')
      .map(update => {
        return {numbers: update.split(',').map(num => parseInt(num))}
      })

    return {comparisons: comparisons, updates: updates}
  }

  function solvePart1(input: PuzzleInput): bigint {

    function checkUpdate(update: Update): boolean {
      const comparisons = lodash.zipWith(
        lodash.initial(update.numbers),
        lodash.tail(update.numbers),
        (left, right) => ({left: left, right: right})
      )

      return lodash.every(
        comparisons,
        (comparison) =>
          lodash.find(input.comparisons, s => lodash.isEqual(s, comparison))!!
      )
    }

    return BigInt(
      lodash.sum(
        input.updates
          .filter(checkUpdate)
          .map(update => update.numbers[(update.numbers.length - 1) / 2])
      )
    )
  }

  return DayWith(
    "05",
    parseInput,
    solvePart1,
    (x) => BigInt(0)
  )
}

export default Day05
