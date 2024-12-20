import * as Types from '../Utils/Types.ts'
import { Position2d, Solution } from '../Utils/Types.ts'
import * as MathUtil from '../Utils/MathUtil.ts'
import DayWith from '../Utils/DayUtil.tsx'
import { parseStringPositionMap, StringPosition, StringPositionTypedMap } from '../Utils/InputUtil.ts'
import lodash from 'lodash'

type PuzzleInput = {
  map: StringPositionTypedMap<Element>
  start: Position2d
  end: Position2d,
  height: number,
  width: number
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
  const width = asArray.filter(([key]) => JSON.parse(key).y === 0).length
  const height = asArray.length / width
  const start = asArray.find(([_, value]) => value === 'S')!![0]
  const end = asArray.find(([_, value]) => value === 'E')!![0]


  return {
    map: new Map(asArray.map(([key, value]) => [key, parseElement(value)])),
    start: JSON.parse(start),
    end: JSON.parse(end),
    width: width,
    height: height
  }
}

function neighbours(position: Position2d, elementMap: ElementMap): Position2d[] {
  return Types.neighbours(position).filter(neighbour => {
    const neighbourSymbol = elementMap.get(JSON.stringify(neighbour))
    return neighbourSymbol === Element.EMPTY
  })
}

function shortest(start: Position2d, end: Position2d, elementMap: ElementMap): number | undefined {
  const layers = MathUtil.reachabilityLayers(neighbours, [start], [end], elementMap)
  return layers !== undefined ? layers.length : undefined
}

function follow(input: PuzzleInput, target: Position2d): Position2d[] {
  const visited = new Set<StringPosition>()

  let current = input.start
  let onPath: Position2d[] = []

  while (!lodash.isEqual(current, target)) {
    visited.add(JSON.stringify(current))
    const next = neighbours(current, input.map).filter(neighbour => !visited.has(JSON.stringify(neighbour)))[0]
    onPath.push(next)
    current = next
  }

  return onPath
}

function findAllShortcuts(input: PuzzleInput): number {
  const defaultPath = follow(input, input.end)
  const defaultLength = defaultPath.length
  const indicesOnDefaultPath =
    new Map(
      defaultPath.map((pos, index) => [JSON.stringify(pos), index + 1])
    )
      .set(JSON.stringify(input.start), 0)

  const allWalls = Array.from(input.map.entries())
    .filter(([pos, value]) => {
        const position = JSON.parse(pos) as Position2d
        // If there are less than two empty spaces, then removing the wall will not change anything.
        const around = neighbours(position, input.map).length

        return value === Element.WALL && around > 1 && position.x !== 0 && position.y !== 0 && position.x !== input.width - 1 && position.y !== input.height - 1
      }
    )
    .map(([pos]) => JSON.parse(pos) as Position2d)

  function checkWall(position2d: Position2d): number | undefined {
    const aroundIndices = neighbours(position2d, input.map)
      .map(neighbour => indicesOnDefaultPath.get(JSON.stringify(neighbour)))
    const min = lodash.min(aroundIndices)!!
    const max = lodash.max(aroundIndices)!!
    return min + 2 + (defaultLength - max)
  }

  const shorter = allWalls.filter(pos => {
    const withoutWall = checkWall(pos)
    return withoutWall !== undefined && withoutWall <= defaultLength - 100
  })

  return shorter.length
}


function solve(input: PuzzleInput): Solution<bigint> {
  const checkShortcuts = findAllShortcuts(input)

  return {
    part1: BigInt(checkShortcuts),
    part2: BigInt(0)
  }
}

function Day20() {
  return DayWith('20', parse, solve)
}

export default Day20
