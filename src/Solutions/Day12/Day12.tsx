import { neighbours, Position2d, Solution } from "../Utils/Types.ts"
import DayWith from "../Utils/DayUtil.tsx"
import lodash from "lodash"
import { sum } from "../Utils/MathUtil.ts"

type Symbol = string

type PuzzleInput = {
  map: Map<string, Symbol>
}

function parseInput(input: string): PuzzleInput {
  const map = input
    .split("\n")
    .filter((line) => line.length > 0)
    .flatMap((line, y) => {
      return line.split("").map((char, x) => {
        return [JSON.stringify({ x: x, y: y }), char] as [string, Symbol]
      })
    })

  return { map: new Map(map) }
}

type Cell = {
  symbol: Symbol
  position: Position2d
  neighbours: number
}

function neighboursOnMap(
  position: Position2d,
  map: Map<string, Symbol>,
): [Cell, Position2d[]] {
  const stringPosition = JSON.stringify(position)
  const symbol = map.get(stringPosition)!!
  const next = neighbours(position).filter((neighbour) => {
    const neighbourSymbol = map.get(JSON.stringify(neighbour))
    return neighbour !== undefined && neighbourSymbol === symbol
  })

  return [
    {
      symbol: symbol,
      position: position,
      neighbours: next.length,
    },
    next,
  ]
}

function allNeighbourhoods(map: Map<string, Symbol>): Cell[][] {
  const unvisited = new Set(map.keys())
  const neighbourhoods: Cell[][] = []

  function neighbourhoodOnMap(
    position: Position2d,
    map: Map<string, Symbol>,
  ): Cell[] {
    function iterate(positions: Position2d[], currentCells: Cell[]): Cell[] {
      if (positions.length === 0) {
        return currentCells
      } else {
        const next = positions.map((position) => neighboursOnMap(position, map))
        const cells = next.map(([cell]) => cell)
        const nextPositions = lodash
          .uniq(
            next
              .flatMap(([, ps]) => ps.map((p) => JSON.stringify(p)))
              .filter((pos) => unvisited.has(pos)),
          )
          .map((p) => JSON.parse(p) as Position2d)
        const nextCells = currentCells.concat(cells)
        positions.map((p) => unvisited.delete(JSON.stringify(p)))
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

function area(cells: Cell[]): bigint {
  return BigInt(cells.length)
}

function perimeter(cells: Cell[]): bigint {
  return BigInt(lodash.sum(cells.map((cell) => 4 - cell.neighbours)))
}

function solution1(cellsBlocks: Cell[][]): bigint {
  return sum(
    cellsBlocks.map((cells) => {
      const a = area(cells)
      const p = perimeter(cells)
      return a * p
    }),
  )
}

function solve(input: PuzzleInput): Solution<bigint> {
  const neighbourhoods = allNeighbourhoods(input.map)
  return {
    part1: solution1(neighbourhoods),
    part2: solution2(neighbourhoods),
  }
}

enum Direction {
  Up,
  Right,
  Down,
  Left,
}

function nextDirection(direction: Direction): Direction {
  return (direction + 1) % 4
}

function inDirection(position: Position2d, direction: Direction): Position2d {
  switch (direction) {
    case Direction.Up:
      return { x: position.x, y: position.y - 1 }
    case Direction.Right:
      return { x: position.x + 1, y: position.y }
    case Direction.Down:
      return { x: position.x, y: position.y + 1 }
    case Direction.Left:
      return { x: position.x - 1, y: position.y }
  }
}

enum Diagonal {
  UpRight,
  DownRight,
  DownLeft,
  UpLeft,
}

function clockwise(direction: Direction): Diagonal {
  switch (direction) {
    case Direction.Up:
      return Diagonal.UpRight
    case Direction.Right:
      return Diagonal.DownRight
    case Direction.Down:
      return Diagonal.DownLeft
    case Direction.Left:
      return Diagonal.UpLeft
  }
}

const directions = [
  Direction.Up,
  Direction.Right,
  Direction.Down,
  Direction.Left,
]

function diagonal(position: Position2d, diagonal: Diagonal): Position2d {
  switch (diagonal) {
    case Diagonal.UpRight:
      return { x: position.x + 1, y: position.y - 1 }
    case Diagonal.DownRight:
      return { x: position.x + 1, y: position.y + 1 }
    case Diagonal.DownLeft:
      return { x: position.x - 1, y: position.y + 1 }
    case Diagonal.UpLeft:
      return { x: position.x - 1, y: position.y - 1 }
  }
}

function isInCellBlock(position: Position2d, cells: Cell[]): boolean {
  return lodash.some(cells, (cell) => lodash.isEqual(cell.position, position))
}

function sides(cells: Cell[]): bigint {
  const allSides = cells.map((cell) => {
    const sides = directions.filter((direction) => {
      const neighbour = inDirection(cell.position, direction)
      const inCellBlock = isInCellBlock(neighbour, cells)
      /* If the neighbour in that direction is in the area,
         we have something like AA (with direction Right),
         i.e. no new sides can be added from the point of view of the leftmost A.
       */
      if (inCellBlock) {
        return false
      } else {
        const nextDir = nextDirection(direction)
        const nextNeighbour = inDirection(cell.position, nextDir)
        /* We now cover the following cases, where the direction is still Right:

           AX The neighbour at X is not in the cell block, and also Z is not in the cell block
           Z?

           and

           AX The diagonal DownRight is in the cell block, meaning that the lower right corner needs to be A, too.
           AA

           In the first case, we have a new side, because we changed directions.
           In the second case, there is also a directional change, but in the other direction.
         */

        const rotatedIsNotInCellBlock = !isInCellBlock(nextNeighbour, cells)
        const nextDiagonal = clockwise(direction)
        const diagonalNeighbour = diagonal(cell.position, nextDiagonal)
        const diagonalInCellBlock = isInCellBlock(diagonalNeighbour, cells)

        return rotatedIsNotInCellBlock || diagonalInCellBlock
      }
    }).length
    return sides
  })

  const total = lodash.sum(allSides)

  return BigInt(total)
}

function solution2(cellsBlocks: Cell[][]): bigint {
  return sum(cellsBlocks.map((cell) => sides(cell) * area(cell)))
}

function Day12() {
  return DayWith("12", parseInput, solve)
}

export default Day12
