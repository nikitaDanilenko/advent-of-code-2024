import DayWith from "../Utils/DayUtil.tsx";
import solutionFrom, {Position2d} from "../Utils/Types.ts";

function Day06() {

  type StringPosition = string

  type PuzzleInput = {
    // Contents are expected to be string versions of Position2d
    obstacles: Set<StringPosition>,
    width: number,
    height: number,
    start: Position2d
  }

  function parseInput(text: string): PuzzleInput {
    const lines = text.split("\n").filter((line) => line !== "")
    const width = lines[0].length
    const height = lines.length
    const indexed: [Position2d, string][] = lines.flatMap((line, y) => {
      return line.split("").map((char, x) => {
        const result: [Position2d, string] = [{x: x, y: y}, char]
        return result
      })
    })

    const obstacles = new Set(
      indexed
        .filter(([, char]) => char === "#")
        .map(([pos]) => JSON.stringify(pos))
    )

    const startingPosition = indexed.find(([, char]) => char === "^")!![0]

    return {obstacles: obstacles, width: width, height: height, start: startingPosition}
  }

  enum Direction {
    Up,
    Down,
    Left,
    Right
  }

  function moveAttempt(pos: Position2d, direction: Direction): Position2d {
    switch (direction) {
      case Direction.Up:
        return {x: pos.x, y: pos.y - 1}
      case Direction.Down:
        return {x: pos.x, y: pos.y + 1}
      case Direction.Left:
        return {x: pos.x - 1, y: pos.y}
      case Direction.Right:
        return {x: pos.x + 1, y: pos.y}
    }
  }

  function validPosition(position: Position2d, width: number, height: number): boolean {
    return position.x >= 0 && position.x < width && position.y >= 0 && position.y < height
  }

  function rotate(direction: Direction): Direction {
    switch (direction) {
      case Direction.Up:
        return Direction.Right
      case Direction.Right:
        return Direction.Down
      case Direction.Down:
        return Direction.Left
      case Direction.Left:
        return Direction.Up
    }
  }

  function move(pos: Position2d, direction: Direction, width: number, height: number, obstacles: Set<StringPosition>): [Position2d, Direction] | undefined {
    const newPos = moveAttempt(pos, direction)
    const newPosString = JSON.stringify(newPos)
    if (obstacles.has(newPosString)) {
      return move(pos, rotate(direction), width, height, obstacles)
    } else if (!validPosition(pos, width, height)) {
      return undefined
    } else {
      return [newPos, direction]
    }
  }

  function moveUntilOutside(input: PuzzleInput): Set<StringPosition> {

    let position = input.start
    let next = move(input.start, Direction.Up, input.width, input.height, input.obstacles)
    let visited = new Set<StringPosition>()

    while(!!next) {
      visited = visited.add(JSON.stringify(position))
      const [newPos, newDirection] = next
      position = newPos
      next = move(newPos, newDirection, input.width, input.height, input.obstacles)
    }

    return visited
  }

  function solvePart1(input: PuzzleInput): bigint {
    return BigInt(moveUntilOutside(input).size)
  }

  function solvePart2(input: PuzzleInput): bigint {
    return BigInt(0)
  }

  return DayWith(
    "06",
    parseInput,
    solutionFrom(
      solvePart1,
      solvePart2
    )
  )
}

export default Day06;
