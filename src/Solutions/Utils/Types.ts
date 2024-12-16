export type Pair<A, B> = {
  first: A
  second: B
}

export type Position2d = {
  x: number
  y: number
}

export function neighbours(position: Position2d): Position2d[] {
  return [
    { x: position.x - 1, y: position.y },
    { x: position.x + 1, y: position.y },
    { x: position.x, y: position.y - 1 },
    { x: position.x, y: position.y + 1 }
  ]
}

export enum Direction4 {
  Up,
  Right,
  Down,
  Left
}

export function parseDirection4(up: string, right: string, down: string, left: string, text: string): Direction4 {
  switch (text) {
    case up:
      return Direction4.Up
    case right:
      return Direction4.Right
    case down:
      return Direction4.Down
    case left:
      return Direction4.Left
    default:
      throw new Error(`Invalid direction: ${text}`)
  }
}

export function positionInDirection4(position: Position2d, direction: Direction4): Position2d {
  switch (direction) {
    case Direction4.Up:
      return { x: position.x, y: position.y - 1 }
    case Direction4.Right:
      return { x: position.x + 1, y: position.y }
    case Direction4.Down:
      return { x: position.x, y: position.y + 1 }
    case Direction4.Left:
      return { x: position.x - 1, y: position.y }
  }
}

export type Solution<T> = {
  part1: T
  part2: T
}

export default function solutionFrom<PuzzleInput, T>(
  solvePart1: (input: PuzzleInput) => T,
  solvePart2: (input: PuzzleInput) => T
) {
  return (input: PuzzleInput): Solution<T> => {
    return {
      part1: solvePart1(input),
      part2: solvePart2(input)
    }
  }
}
