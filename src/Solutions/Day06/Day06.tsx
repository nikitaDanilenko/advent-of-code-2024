import DayWith from "../Utils/DayUtil.tsx"
import {Position2d, Solution} from "../Utils/Types.ts"

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

  function moveInDirection(pos: Position2d, direction: Direction): Position2d {
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
    const newPos = moveInDirection(pos, direction)
    const newPosString = JSON.stringify(newPos)
    if (obstacles.has(newPosString)) {
      return move(pos, rotate(direction), width, height, obstacles)
    } else if (!validPosition(newPos, width, height)) {
      return undefined
    } else {
      return [newPos, direction]
    }
  }

  function moveUntilOutside(input: PuzzleInput): Set<StringPosition> {
    let next: [Position2d, Direction] | undefined = [input.start, Direction.Up]
    let visited = new Set<StringPosition>()

    while (!!next) {
      const [position, direction] = next
      visited = visited.add(JSON.stringify(position))
      next = move(position, direction, input.width, input.height, input.obstacles)
    }

    return visited
  }

  function isOnLoop(input: PuzzleInput): boolean {
    function iterate(positionWithDirection: [Position2d, Direction] | undefined, visited: Set<string>): boolean {
      if (!positionWithDirection) {
        return false
      } else {
        const [position, direction] = positionWithDirection
        const currentPositionWithDirection = JSON.stringify({x: position.x, y: position.y, direction: direction})

        function checkNext() {
          const newVisited = visited.add(currentPositionWithDirection)
          const next = move(position, direction, input.width, input.height, input.obstacles)
          return iterate(next, newVisited)
        }

        return visited.has(currentPositionWithDirection) || checkNext()
      }
    }

    return iterate([input.start, Direction.Up], new Set())
  }

  function solve(input: PuzzleInput): Solution<bigint> {
    const visitedInitial = moveUntilOutside(input)
    const moveCount = BigInt(visitedInitial.size)

    // We only need to check those elements that are not the starting position,
    // but have been visited otherwise, because other positions cannot be reached.
    const onLoop = Array
      .from(visitedInitial)
      .filter((position) => {
        function checkLoop() {
          // Rant: Good grief: 'add' modifies the set in place, but still returns itself.
          //       Hence, we need a copy of the input to avoid modifying it several times.
          const modifiedInput = {...input, obstacles: new Set(input.obstacles).add(position)}
          return isOnLoop(modifiedInput)
        }
        return position !== JSON.stringify(input.start) && checkLoop()
      })
      .length

    return {
      part1: moveCount,
      part2: BigInt(onLoop)
    }
  }

  return DayWith(
    "06",
    parseInput,
    solve
  )
}

export default Day06
