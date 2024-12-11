import {parseStringPositionMap, StringPosition} from "../Utils/InputUtil.ts"
import {Position2d, Solution} from "../Utils/Types.ts"
import DayWith from "../Utils/DayUtil.tsx"
import lodash from "lodash";

type NumberMap = Map<StringPosition, number>

type PuzzleInput = {
  map: NumberMap
}

function parseInput(input: string): PuzzleInput {
  const map =
    Array.from(parseStringPositionMap(input).entries())
      .map(([key, value]) => [key, parseInt(value)] as [StringPosition, number])
  return {map: new Map(map)}
}

function neighborPositions(position: Position2d): Position2d[] {
  return [
    {x: position.x - 1, y: position.y},
    {x: position.x + 1, y: position.y},
    {x: position.x, y: position.y - 1},
    {x: position.x, y: position.y + 1}
  ]
}
// BFS, but we do not need to keep track of visited nodes, because there is never a way back.
function successors(position: Position2d, map: NumberMap): Position2d[] {
  const candidates = neighborPositions(position)
  const atPosition = map.get(JSON.stringify(position))!!
  const connected = makeUnique(candidates.flatMap((candidate) => {
    const key = JSON.stringify(candidate)
    const value = map.get(key)
    return (!!value && atPosition === value - 1) ? [candidate] : []
  }))

  return connected
}

function successorsList(positions: Position2d[], map: NumberMap): Position2d[] {
  return makeUnique(positions.flatMap((position) => successors(position, map)))
}

function successorsN(positions: Position2d[], map: NumberMap, steps: number): Position2d[] {
  return lodash.range(0, steps).reduce((acc, _) => successorsList(acc, map), positions)
}

function makeUnique(positions: Position2d[]): Position2d[] {
  return Array.from(new Set(positions.map((position) => JSON.stringify(position))))
    .map((x) => JSON.parse(x) as Position2d)
}

function solve(input: PuzzleInput): Solution<bigint> {
  const startPositions =
    Array.from(input.map.entries())
      .filter(([_, value]) => value === 0)
      .map(([key, _]) => JSON.parse(key) as Position2d)

  const steps = 9

  const endPositions =
    lodash.sum(startPositions.map((position) => successorsN([position], input.map, steps).length))

  return {
    part1: BigInt(endPositions),
    part2: BigInt(0)
  }
}

function Day10() {
  return DayWith(
    "10",
    parseInput,
    solve
  )
}

export default Day10

