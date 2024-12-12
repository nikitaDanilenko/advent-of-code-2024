import {neighbours, Position2d, Solution} from "../Utils/Types.ts"
import DayWith from "../Utils/DayUtil.tsx"
import lodash from "lodash";
import {sum} from "../Utils/MathUtil.ts";

type Symbol = string

type PuzzleInput = {
  map: Map<string, Symbol>
}

function parseInput(input: string): PuzzleInput {
  const map =
    input
      .split("\n")
      .filter(line => line.length > 0)
      .flatMap(
        (line, y) => {
          return line
            .split('')
            .map((char, x) => {
              return [JSON.stringify({x: x, y: y}), char] as [string, Symbol]
            })
        })

  return {map: new Map(map)}
}

type Cell = {
  symbol: Symbol,
  position: Position2d,
  neighbours: number
}

function neighboursOnMap(position: Position2d, map: Map<string, Symbol>): [Cell, Position2d[]] {
  const stringPosition = JSON.stringify(position)
  const symbol = map.get(stringPosition)!!
  const next =
    neighbours(position)
      .filter(neighbour => {
        const neighbourSymbol = map.get(JSON.stringify(neighbour))
        return neighbour !== undefined && neighbourSymbol === symbol
      })

  return [{
    symbol: symbol,
    position: position,
    neighbours: next.length
  }, next]
}

function allNeighbourhoods(map: Map<string, Symbol>): Cell[][] {
  const unvisited = new Set(map.keys())
  const neighbourhoods: Cell[][] = []

  function neighbourhoodOnMap(position: Position2d, map: Map<string, Symbol>): Cell[] {
    function iterate(positions: Position2d[], currentCells: Cell[]): Cell[] {
      if (positions.length === 0) {
        return currentCells
      } else {
        const next = positions.map(position => neighboursOnMap(position, map))
        const cells = next.map(([cell,]) => cell)
        const nextPositions =
          lodash
            .uniq(
              next
                .flatMap(([, ps]) => ps.map(p => JSON.stringify(p)))
                .filter(pos => unvisited.has(pos))
            )
            .map(p => JSON.parse(p) as Position2d)
        const nextCells = currentCells.concat(cells)
        positions.map(p => unvisited.delete(JSON.stringify(p)))
        return iterate(nextPositions, nextCells)
      }
    }

    return iterate([position], [])
  }

  while (unvisited.size > 0) {
    const key = unvisited.values().next().value!!
    const position = JSON.parse(key) as Position2d
    const neighbourhood = neighbourhoodOnMap(position, map)
    neighbourhoods.push(neighbourhood)
  }

  return neighbourhoods
}

function solution1(cellsBlocks: Cell[][]): bigint {
  function area(cells: Cell[]): bigint {
    return BigInt(cells.length)
  }

  function perimeter(cells: Cell[]): bigint {
    return BigInt(lodash.sum(cells.map(cell => 4 - cell.neighbours)))
  }

  return sum(cellsBlocks.map(cells => {
    const a = area(cells)
    const p = perimeter(cells)
    return a * p
  }))
}

function solve(input: PuzzleInput): Solution<bigint> {
  const neighbourhoods = allNeighbourhoods(input.map)
  return {
    part1: solution1(neighbourhoods),
    part2: BigInt(0)
  }
}

function Day12() {
  return DayWith(
    "12",
    parseInput,
    solve
  )
}


export default Day12
