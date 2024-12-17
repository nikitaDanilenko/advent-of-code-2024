import * as Types from '../Utils/Types.ts'
import { Direction4, Position2d, Solution } from '../Utils/Types.ts'
import DayWith from '../Utils/DayUtil.tsx'
import { parseStringPositionMap, StringPosition } from '../Utils/InputUtil.ts'
import lodash from 'lodash'

type PuzzleInput = {
  start: Position2d
  end: Position2d
  maze: Maze
}

type Maze = Map<StringPosition, Element>

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

type Tropical = number | undefined

function lessOrEqual(a: Tropical, b: Tropical): boolean {
  if (a === undefined)
    return false
  else if (b === undefined) {
    return true
  } else return a <= b
}

const allDirections4 = [Direction4.Up, Direction4.Right, Direction4.Down, Direction4.Left]

function neighbours(pos: Position2d, maze: Maze): [Direction4, Position2d][] {
  const candidates = allDirections4.map(direction => [direction, Types.positionInDirection4(pos, direction)] as [Direction4, Position2d])
  return candidates.filter(([, candidate]) => {
    const inMaze = maze.get(JSON.stringify(candidate))
    return inMaze !== undefined && inMaze !== Element.Wall
  })
}

type DirPos = {
  enterDirection: Direction4
  position: Position2d
}

type StringDirPos = string

function dijkstra(start: Position2d, maze: Maze): [Map<StringPosition, Tropical>, Map<StringPosition, StringPosition[]>] {
  const distances = new Map<StringDirPos, Tropical>()
  const previous = new Map<StringDirPos, StringPosition[]>()

  const queue = new Set<StringPosition>()

  // Initialization. We skip "previous[i] = undefined", because maps already behave like that.
  maze.forEach((_, key) => {
    const position = JSON.parse(key) as Position2d
    allDirections4.forEach(direction => {
      const strDirPos = JSON.stringify({ enterDirection: direction, position: position })
      queue.add(strDirPos)
    })
  })

  distances.set(JSON.stringify({ enterDirection: Direction4.Right, position: start }), 0)

  while (queue.size > 0) {
    if (queue.size % 1000 === 0) {
      console.log(queue.size)
    }

    // This conversion is extremely inefficient.
    const ds = Array.from(queue.values()).map(key => [key, distances.get(key)] as [StringDirPos, Tropical])
    const [leastKey, leastDistance] = ds
      .filter(([_, distance]) => distance !== undefined)
      .reduce((acc, candidate) => {
          const [, currentMinDistance] = acc
          const [, distance] = candidate
          return lessOrEqual(distance, currentMinDistance) ? candidate : acc
        },
        ['', undefined] as [StringDirPos, Tropical]
      )
    // This reduces the number of vertices to traverse: Once there is no vertex with a known distance, we do not need to continue,
    // because the one condition, where values are getting set will never be reached.
    if (leastDistance === undefined) {
      break
    }
    queue.delete(leastKey)

    const leastDirPos = JSON.parse(leastKey) as DirPos
    const neighboursInQueue = neighbours(leastDirPos.position, maze)
      .filter(([direction, neighbour]) => queue.has(JSON.stringify({
        enterDirection: direction,
        position: neighbour
      })))

    neighboursInQueue.forEach(([direction, neighbour]) => {
      const dirPos = { enterDirection: direction, position: neighbour }
      const strDirPos = JSON.stringify(dirPos)

      const weightToNeighbour: number = direction === leastDirPos.enterDirection ? 1 : 1001
      // This looks terribly wrong, but !!leastDistance is again problematic due to falsy values.
      const alternative = leastDistance !== undefined ? leastDistance + weightToNeighbour : undefined
      const neighbourDistance = distances.get(strDirPos)

      if (lessOrEqual(alternative, neighbourDistance)) {
        distances.set(strDirPos, alternative)
        previous.set(strDirPos, (previous.get(strDirPos) ?? []).concat(leastKey))
      }
    })
  }

  return [distances, previous]
}

function solve(input: PuzzleInput): Solution<bigint> {
  const [weights, previous] = dijkstra(input.start, input.maze)

  // There is so much wrong here.
  // Why do we need conversions? Why is there no better function for set operations that fetch both components?
  const lightest =
    Array.from(weights.entries()).filter(([key, _]) => lodash.isEqual((JSON.parse(key) as DirPos).position, input.end))
      .map(([_, value]) => value)
      .filter(value => value !== undefined)
      .reduce((acc, candidate) => Math.min(acc, candidate))

  const leadingToTarget =
    Array.from(previous.entries()).filter(([key, _]) => lodash.isEqual((JSON.parse(key) as DirPos).position, input.end) && weights.get(key) === lightest)

  let [, predecessors] = leadingToTarget[0]

  // Note the array brackets, because otherwise, the set will be initiated from the string that is converted to a set,
  // i.e. an array of single characters.
  // Who thought that this conversion is a good idea?
  let onPaths: Set<string> = new Set([JSON.stringify(input.end)])

  while (predecessors.length > 0) {
    predecessors.forEach(predecessor => {
      const position = (JSON.parse(predecessor) as DirPos).position
      onPaths.add(JSON.stringify(position))
    })
    predecessors = predecessors.flatMap(predecessor => previous.get(predecessor) ?? [])
  }
  console.log(onPaths)

  return {
    part1: BigInt(lightest),
    part2: BigInt(onPaths.size)
  }
}

function Day16() {
  return DayWith('16', parse, solve)
}

export default Day16
