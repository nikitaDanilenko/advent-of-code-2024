import { parseStringPositionMap, StringPosition } from "../Utils/InputUtil.ts"
import { Position2d, Solution } from "../Utils/Types.ts"
import DayWith from "../Utils/DayUtil.tsx"
import lodash from "lodash"

type NumberMap = Map<StringPosition, number>

type PuzzleInput = {
  map: NumberMap
}

function parseInput(input: string): PuzzleInput {
  const map = Array.from(parseStringPositionMap(input).entries()).map(
    ([key, value]) => [key, parseInt(value)] as [StringPosition, number]
  )
  return { map: new Map(map) }
}

function neighborPositions(position: Position2d): Position2d[] {
  return [
    { x: position.x - 1, y: position.y },
    { x: position.x + 1, y: position.y },
    { x: position.x, y: position.y - 1 },
    { x: position.x, y: position.y + 1 }
  ]
}

// BFS, but we do not need to keep track of visited nodes, because there is never a way back.
function successors(position: Position2d, map: NumberMap): Position2d[] {
  const candidates = neighborPositions(position)
  const atPosition = map.get(JSON.stringify(position))!!
  const connected = makeUnique(
    candidates.flatMap(candidate => {
      const key = JSON.stringify(candidate)
      const value = map.get(key)
      return !!value && atPosition === value - 1 ? [candidate] : []
    })
  )

  return connected
}

type Path = Position2d[]

// Yes, one could abstract this into a general function (see vector matrix multiplication),
// but here it feels like too much of a hassle.
function successorsWithPaths(
  positionWithPaths: [Position2d, Path[]],
  map: NumberMap
): [Position2d, Path[]][] {
  const [position, paths] = positionWithPaths
  const candidates = neighborPositions(position)
  const atPosition = map.get(JSON.stringify(position))!!
  const connected = candidates.flatMap(candidate => {
    const key = JSON.stringify(candidate)
    const value = map.get(key)
    const extendedPaths = paths.map(path => [...path, candidate])
    return !!value && atPosition === value - 1
      ? ([[candidate, extendedPaths]] as [Position2d, Path[]][])
      : ([] as [Position2d, Path[]][])
  })
  return connected
}

function successorsListWithPaths(
  positions: [Position2d, Path[]][],
  map: NumberMap
): [Position2d, Path[]][] {
  return positions.flatMap(position => successorsWithPaths(position, map))
}

function successorsNWithPaths(
  positions: [Position2d, Path[]][],
  map: NumberMap,
  steps: number
): [Position2d, Path[]][] {
  return lodash
    .range(0, steps)
    .reduce((acc, _) => successorsListWithPaths(acc, map), positions)
}

function successorsList(positions: Position2d[], map: NumberMap): Position2d[] {
  return makeUnique(positions.flatMap(position => successors(position, map)))
}

function successorsN(
  positions: Position2d[],
  map: NumberMap,
  steps: number
): Position2d[] {
  return lodash
    .range(0, steps)
    .reduce((acc, _) => successorsList(acc, map), positions)
}

function makeUnique(positions: Position2d[]): Position2d[] {
  return Array.from(
    new Set(positions.map(position => JSON.stringify(position)))
  ).map(x => JSON.parse(x) as Position2d)
}

function solve(input: PuzzleInput): Solution<bigint> {
  const startPositions = Array.from(input.map.entries())
    .filter(([_, value]) => value === 0)
    .map(([key, _]) => JSON.parse(key) as Position2d)

  const steps = 9

  const endPositions = lodash.sum(
    startPositions.map(
      position => successorsN([position], input.map, steps).length
    )
  )

  const endPositionsWithPaths = lodash.sum(
    startPositions.map(position => {
      const targets = successorsNWithPaths([[position, [[]]]], input.map, steps)
      const fullPathNumbers = targets.map(target => {
        const [p, paths] = target
        const fullPaths = new Set(
          paths.map(path => JSON.stringify([...path, p]))
        ).size
        return fullPaths
      })
      return lodash.sum(fullPathNumbers)
    })
  )

  return {
    part1: BigInt(endPositions),
    part2: BigInt(endPositionsWithPaths)
  }
}

function Day10() {
  return DayWith("10", parseInput, solve)
}

export default Day10
