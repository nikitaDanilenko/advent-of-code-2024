import * as Types from '../Utils/Types.ts'
import { Position2d, Solution } from '../Utils/Types.ts'
import DayWith from '../Utils/DayUtil.tsx'
import { parseStringPositionMap, StringPosition, StringPositionTypedMap } from '../Utils/InputUtil.ts'
import lodash from 'lodash'

type PuzzleInput = {
  map: StringPositionTypedMap<Element>
  start: Position2d
  end: Position2d
}

type ElementMap = StringPositionTypedMap<Element>

enum Element {
  EMPTY = '.',
  WALL = '#'
}

function parseElement(char: string): Element {
  switch (char) {
    case Element.WALL:
      return Element.WALL
    default:
      return Element.EMPTY
  }
}

function parse(input: string): PuzzleInput {
  const preMap = parseStringPositionMap(input)
  const asArray = Array.from(preMap.entries())
  const start = asArray.find(([_, value]) => value === 'S')!![0]
  const end = asArray.find(([_, value]) => value === 'E')!![0]


  return {
    map: new Map(asArray.map(([key, value]) => [key, parseElement(value)])),
    start: JSON.parse(start),
    end: JSON.parse(end)
  }
}

function neighbours(position: Position2d, elementMap: ElementMap): Position2d[] {
  return Types.neighbours(position).filter(neighbour => {
    const neighbourSymbol = elementMap.get(JSON.stringify(neighbour))
    return neighbourSymbol === Element.EMPTY
  })
}

function follow(input: PuzzleInput): Position2d[] {
  const visited = new Set<StringPosition>()

  function iterate(current: Position2d, onPath: Position2d[]): Position2d[] {
    if (lodash.isEqual(current, input.end))
      return onPath
    else {
      visited.add(JSON.stringify(current))
      const next = neighbours(current, input.map).filter(neighbour => !visited.has(JSON.stringify(neighbour)))
      const nextPath = next.flatMap(neighbour => iterate(neighbour, [...onPath, neighbour]))
      return nextPath
    }
  }

  return iterate(input.start, [])

}

function solve(input: PuzzleInput): Solution<bigint> {
  console.log(input)
  return {
    part1: BigInt(0),
    part2: BigInt(0)
  }
}

function Day20() {
  return DayWith('20', parse, solve)
}

export default Day20
