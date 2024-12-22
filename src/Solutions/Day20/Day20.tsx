import * as Types from '../Utils/Types.ts'
import { Position2d, Solution } from '../Utils/Types.ts'
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
  const start = asArray.find(([_, value]) => value === 'S')![0]
  const end = asArray.find(([_, value]) => value === 'E')![0]


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

function p1distance(position1: Position2d, position2: Position2d): number {
  return Math.abs(position1.x - position2.x) + Math.abs(position1.y - position2.y)
}

function findAllShortCutsWith(distance: number, improvement: number, input: PuzzleInput): number {
  const defaultPath = [input.start, ...follow(input, input.end)]
  const defaultLength = defaultPath.length - 1

  type Candidate = {
    earlierIndex: number,
    earlierPosition: Position2d,
    laterIndex: number,
    laterPosition: Position2d,
    distance: number
  }

  let candidates: Candidate[] = []

  for (let i = 0; i < defaultPath.length; i++) {
    for (let j = i + 1; j < defaultPath.length; j++) {
      const position1 = defaultPath[i]
      const position2 = defaultPath[j]
      const d = p1distance(position1, position2)
      if (d <= distance) {
        candidates.push({
          earlierIndex: i,
          earlierPosition: position1,
          laterIndex: j,
          laterPosition: position2,
          distance: p1distance(position1, position2)
        })
      }
    }
  }
  // The purely functional version of the above loop is the prettier choice, but its running time is about six times as long as that of the non-functional one.
  // const candidates = defaultPath.flatMap((pos1, i) => {
  //     const offset = 1 + i
  //     return defaultPath.slice(offset).flatMap((pos2, j) => {
  //         const d = p1distance(pos1, pos2)
  //         if (d <= distance)
  //           return [{
  //             earlierIndex: i,
  //             earlierPosition: pos1,
  //             laterIndex: offset + j,
  //             laterPosition: pos2,
  //             distance: d
  //           }]
  //         else
  //           return []
  //       }
  //     )
  //   }
  // )


  const validCheats = candidates.filter(candidatePair => {
    const candidateDistance = candidatePair.earlierIndex + candidatePair.distance + defaultLength - candidatePair.laterIndex
    return candidateDistance <= defaultLength - improvement
  })

  return validCheats.length
}

function solve(input: PuzzleInput): Solution<bigint> {
  const checkShortcuts1 = findAllShortCutsWith(2, 100, input)
  const checkShortcuts2 = findAllShortCutsWith(20, 100, input)

  return {
    part1: BigInt(checkShortcuts1),
    part2: BigInt(checkShortcuts2)
  }
}

function Day20() {
  return DayWith('20', parse, solve)
}

export default Day20
