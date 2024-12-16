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

function strictlyLess(a: Tropical, b: Tropical): boolean {
  if (a === undefined)
    return false
  else if (b === undefined) {
    return true
  } else return a < b
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

function dijkstra(start: Position2d, maze: Maze): [Map<StringPosition, Tropical>, Map<StringPosition, StringPosition>] {
  const distances = new Map<StringDirPos, Tropical>()
  const previous = new Map<StringDirPos, StringPosition>()

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
    if (queue.size % 100 === 0) {
      console.log(queue.size)
    }

    const ds = Array.from(queue.values()).map(key => [key, distances.get(key)] as [StringDirPos, Tropical])
    const [leastKey, leastDistance] = ds
      .reduce((acc, candidate) => {
          const [, currentMinDistance] = acc
          const [, distance] = candidate
          return strictlyLess(distance, currentMinDistance) ? candidate : acc
        }
      )
    // console.log(leastKey, leastDistance)
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

      // console.log(`dirPos: ${JSON.stringify(dirPos)}, alternative: ${alternative}, neighbourDistance: ${neighbourDistance}`)
      if (strictlyLess(alternative, neighbourDistance)) {
        distances.set(strDirPos, alternative)
        previous.set(strDirPos, leastKey)
      }
    })
  }

  return [distances, previous]
}

function directionToSymbol(direction: Direction4): string {
  switch (direction) {
    case Direction4.Up:
      return '↑'
    case Direction4.Right:
      return '→'
    case Direction4.Down:
      return '↓'
    case Direction4.Left:
      return '←'
  }
}

function solve(input: PuzzleInput): Solution<bigint> {
  const [weights, previous] = dijkstra(input.start, input.maze)
  const lightest =
    Array.from(weights.entries()).filter(([key, _]) => lodash.isEqual((JSON.parse(key) as DirPos).position, input.end))
      .map(([_, value]) => value)
      .filter(value => value !== undefined)
      .reduce((acc, candidate) => Math.min(acc, candidate))


  // const via = Array.from(previous.entries()).filter(([key, _]) => lodash.isEqual((JSON.parse(key) as DirPos).position, input.end))


  // Debugging...
  // let [pred, succ] = via[0]
  // let finished = false
  // while (!finished) {
  //   const dirPos = JSON.parse(succ) as DirPos
  //   console.log(`position: ${JSON.stringify(dirPos.position)}, direction: ${directionToSymbol(dirPos.enterDirection)}`)
  //   const target = previous.get(pred)
  //   if (target === undefined) {
  //     finished = true
  //   } else {
  //     succ = pred
  //     pred = target
  //   }
  // }

  return {
    part1: BigInt(lightest),
    part2: BigInt(0)
  }
}

function Day16() {
  return DayWith('16', parse, solve)
}

export default Day16
