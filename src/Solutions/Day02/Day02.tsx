import DayWith from '../Utils/DayUtil.tsx'
import * as _ from 'lodash'
import solutionFrom from '../Utils/Types.ts'

function Day02() {
  type Levels = Array<number>

  type PuzzleInput = {
    reports: Array<Levels>
  }

  function parseInput(text: string): PuzzleInput {
    return {
      reports: text
        .split('\n')
        .filter(line => line !== '')
        .map(line => {
          return line.split(' ').map(word => parseInt(word))
        })
    }
  }

  function checkOrder(
    predicate: (x: number, y: number) => boolean,
    levels: Levels
  ): boolean {
    return _.every(
      // Extra 'initial', because 'zipWith' does not trim arrays to the shortest length.
      _.zipWith(_.initial(levels), _.tail(levels), (x, y) => ({
        first: x,
        second: y
      })),
      pair => predicate(pair.first, pair.second)
    )
  }

  const smaller = (x: number, y: number): boolean => x < y && y - x <= 3
  const larger = (x: number, y: number): boolean => x > y && x - y <= 3

  function solvePart1(puzzleInput: PuzzleInput): bigint {
    return BigInt(puzzleInput.reports.filter(isValid).length)
  }

  function isValid(levels: Levels): boolean {
    return checkOrder(smaller, levels) || checkOrder(larger, levels)
  }

  function tryRemoval(levels: Levels): boolean {
    const length = levels.length
    const singleDrops = _.range(0, length).filter(i => {
      const droppedI = levels.slice(0, i).concat(levels.slice(i + 1, length))
      return isValid(droppedI)
    })

    return singleDrops.length > 0
  }

  function solvePart2(puzzleInput: PuzzleInput): bigint {
    const [valid, invalid] = _.partition(puzzleInput.reports, isValid)
    const indirectlyValid = invalid.filter(tryRemoval)
    return BigInt(valid.length + indirectlyValid.length)
  }

  return DayWith<PuzzleInput>(
    '02',
    parseInput,
    solutionFrom(solvePart1, solvePart2)
  )
}

export default Day02
