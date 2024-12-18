import * as Types from '../Utils/Types.ts'
import { parsePosition2d, Position2d, Solution } from '../Utils/Types.ts'
import DayWith from '../Utils/DayUtil.tsx'
import { StringPosition } from '../Utils/InputUtil.ts'
import lodash from 'lodash'

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
  let visited = new Set<StringPosition>()
  const targetSet = target.map(p => JSON.stringify(p))

  function iterate(currentLayer: Position2d[], layers: Position2d[][]): Position2d[][] | undefined {
    const currentLayerStrings = currentLayer.map(p => JSON.stringify(p))
    const intersectionWithTarget = lodash.intersection(currentLayerStrings, targetSet)
    if (intersectionWithTarget.length > 0) {
      return layers
    } else if (currentLayer.length === 0) {
      return undefined
    } else {
      currentLayerStrings.forEach(position => visited.add(position))
      const nextLayer =
        lodash.uniqBy(
          currentLayer
            .flatMap(position => neighbours(position, map))
            .filter(neighbour => !visited.has(JSON.stringify(neighbour))),
          p => JSON.stringify(p)
        )

      return iterate(nextLayer, [...layers, currentLayer])
    }
  }

  return iterate(start, [])
}

const dimension: number = 70

function solve(input: PuzzleInput): Solution<bigint> {
  const start = { x: 0, y: 0 }
  const target = { x: dimension, y: dimension }
  const trimmedSize = 1024
  const map1 = toElementMap(input.positions.slice(0, trimmedSize))
  const part1 = reachabilityLayers([start], [target], map1)!!

  const shortest = part1.length
  return {
    part1: BigInt(shortest),
    part2: BigInt(0)
  }
}

function Day18() {
  return DayWith('18', parse, solve)
}

export default Day18
