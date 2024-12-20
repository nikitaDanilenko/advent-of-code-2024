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
  console.log(defaultLength)
  const distances =
    new Map(
      defaultPath.map((pos, index) => {
        return [JSON.stringify(pos), defaultLength - 1 - index] as [StringPosition, number]
      }))
      .set(JSON.stringify(input.start), defaultLength)


  const allWalls = Array.from(input.map.entries())
    .filter(([pos, value]) => {
        const position = JSON.parse(pos) as Position2d
        return value === Element.WALL && position.x !== 0 && position.y !== 0 && position.x !== input.width - 1 && position.y !== input.height - 1
      }
    )
    .map(([pos]) => JSON.parse(pos) as Position2d)

  console.log(allWalls.length)

  function checkWall(position: Position2d): number | undefined {
    const changedMap = new Map(input.map).set(JSON.stringify(position), Element.EMPTY)
    const firstSegment = shortest(input.start, position, changedMap)
    if (firstSegment !== undefined) {
      const candidates = neighbours(position, input.map)
      const minimum = lodash.min(candidates.map(candidate => {
          const distance = distances.get(JSON.stringify(candidate))
          return distance !== undefined ? distance + 1 + firstSegment : undefined
        }).filter(distance => distance !== undefined)
      )
      return minimum
    } else
      return undefined
  }

  const shorter = allWalls.filter(pos => {
    const withoutWall = checkWall(pos)
    return withoutWall !== undefined && withoutWall < defaultLength
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
