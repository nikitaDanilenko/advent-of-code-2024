import * as Types from '../Utils/Types.ts'
import { parsePosition2d, Position2d, Solution } from '../Utils/Types.ts'
import DayWith from '../Utils/DayUtil.tsx'
import { StringPosition } from '../Utils/InputUtil.ts'
import lodash from 'lodash'
import * as MathUtil from '../Utils/MathUtil.ts'

type PuzzleInput = {
  positions: Position2d[]
}

type ElementMap = Map<StringPosition, Element>

enum Element {
  Empty = '.',
  Byte = '#'
}

function parse(input: string): PuzzleInput {
  return {
    positions: input
      .split('\n')
      .filter(line => line.length > 0)
      .map(parsePosition2d)
  }
}

function toElementMap(positions: Position2d[]): ElementMap {
  const asSet = new Set(positions.map(p => JSON.stringify(p)))

  const cells = lodash.range(0, 1 + dimension).flatMap(y => {
    return lodash.range(0, 1 + dimension).map(x => {
      const position = JSON.stringify({ x: x, y: y })
      const element = asSet.has(position) ? Element.Byte : Element.Empty
      return [position, element] as [StringPosition, Element]
    })
  })

  return new Map(cells)
}

function neighbours(
  position: Position2d,
  map: ElementMap
): Position2d[] {
  const next = Types.neighbours(position).filter(neighbour => {
    const neighbourSymbol = map.get(JSON.stringify(neighbour))
    return neighbourSymbol === Element.Empty
  })

  return next
}

function reachabilityLayers(start: Position2d[], target: Position2d[], map: ElementMap): Position2d[][] | undefined {
  return MathUtil.reachabilityLayers(neighbours, start, target, map)
}

const dimension: number = 70

function solve(input: PuzzleInput): Solution<string> {
  const start = { x: 0, y: 0 }
  const target = { x: dimension, y: dimension }
  const trimmedSize = 1024
  const trimmedPositions = input.positions.slice(0, trimmedSize)
  const map1 = toElementMap(trimmedPositions)
  const part1 = reachabilityLayers([start], [target], map1)!

  const remainingPositions = input.positions.slice(trimmedSize - 1)

  let nextIndex = 0
  let updatedMap = map1
  let hasExitPath = true

  // This could be a lot faster with a binary search.
  // I made a half-hearted attempt, but it turned to be out trickier than I initially thought.
  // TODO: Implement a binary search.
  while (hasExitPath && nextIndex < remainingPositions.length) {
    const nextByte = remainingPositions[nextIndex]
    updatedMap = updatedMap.set(JSON.stringify(nextByte), Element.Byte)
    const exitPath = reachabilityLayers([start], [target], updatedMap)
    if (exitPath === undefined) {
      hasExitPath = false
    } else {
      nextIndex++
    }
  }

  const breakingPosition = remainingPositions[nextIndex]

  const shortest = part1.length
  return {
    part1: shortest.toString(),
    part2: `${breakingPosition.x},${breakingPosition.y}`
  }
}

function Day18() {
  return DayWith('18', parse, solve)
}

export default Day18
