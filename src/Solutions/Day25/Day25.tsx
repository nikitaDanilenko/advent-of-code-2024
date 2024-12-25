import { Solution } from '../Utils/Types.ts'
import DayWith from '../Utils/DayUtil.tsx'
import { parseStringPositionTypedMap, StringPositionTypedMap } from '../Utils/InputUtil.ts'
import lodash from 'lodash'

type PuzzleInput = {
  keys: Key[]
  locks: Lock[]
}

enum Element {
  Empty = '.',
  Part = '#'
}

function parseElement(string: string): Element {
  return string === Element.Empty ? Element.Empty : Element.Part
}

type ElementMap = StringPositionTypedMap<Element>

type Key = ElementMap

type Lock = ElementMap

function toPinSequence(elementMap: ElementMap): number[] {
  return lodash.range(0, 5).map(column =>
    Array.from(elementMap.entries())
      .filter(([position, element]) => {
        const parsedPosition = JSON.parse(position)
        return parsedPosition.x === column && element === Element.Part
      })
      .length - 1
  )
}

function match(key: number[], lock: number[]): boolean {
  return lodash
    .zip(key, lock)
    .every(([key, lock]) => key! + lock! < 6)
}

function parse(input: string): PuzzleInput {
  const blocks = input.split('\n\n')
  const elementMaps = blocks.map(block => parseStringPositionTypedMap(block, parseElement))
  const initialPosition = JSON.stringify({
    x: 0,
    y: 0
  })

  const [locks, keys] = lodash.partition(elementMaps, elementMap => elementMap.get(initialPosition) === Element.Part)

  return {
    locks: locks,
    keys: keys
  }
}

function solve(input: PuzzleInput): Solution<string> {
  const [keys, locks] = [input.keys, input.locks].map(elementMaps => elementMaps.map(toPinSequence))
  const amount = lodash.sum(locks.map(lock => keys.filter(key => match(key, lock)).length))
  return {
    part1: BigInt(amount).toString(),
    part2: 'There is no part 2'
  }
}

function Day25() {
  return DayWith('25', parse, solve)
}

export default Day25
