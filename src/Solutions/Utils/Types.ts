export type Pair<A, B> = {
  first: A,
  second: B
}

export type Position2d = {
  x: number,
  y: number
}

export type Solution<T> = {
  part1: T,
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
