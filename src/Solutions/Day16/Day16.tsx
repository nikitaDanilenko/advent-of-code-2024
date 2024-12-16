import { Position2d, Solution } from '../Utils/Types.ts'
import DayWith from '../Utils/DayUtil.tsx'
import { parseStringPositionMap, StringPosition } from '../Utils/InputUtil.ts'
import lodash from 'lodash'

type PuzzleInput = {
  start: Position2d
  end: Position2d
  maze: Map<StringPosition, Element>
}

enum Element {
  Empty = '.',
  Wall = '#'
}

function parseElement(char: string): Element {
  return char === '#' ? Element.Wall : Element.Empty
}

function parse(input: string): PuzzleInput {
  const map = parseStringPositionMap(input)
  const entries = Array.from(map.entries())

  function findPosition(char: string): Position2d {
    return JSON.parse(lodash.find(entries, ([, value]) => value === char)!![0]) as Position2d
  }

  const start = findPosition('S')
  const end = findPosition('E')

  const maze = new Map(entries.map(([key, value]) => [key, parseElement(value)]))

  return {
    start: start,
    end: end,
    maze: maze
  }
}

function solve(input: PuzzleInput): Solution<bigint> {
  console.log(input)
  return {
    part1: BigInt(0),
    part2: BigInt(0)
  }
}

function Day16() {
  return DayWith('16', parse, solve)
}

export default Day16
