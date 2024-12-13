import {Position2d, Solution} from "../Utils/Types.ts"
import DayWith from "../Utils/DayUtil.tsx"
import {sum} from "../Utils/MathUtil.ts";

type Equation = {
  a: Position2d,
  b: Position2d,
  target: Position2d
}

type PuzzleInput = {
  equations: Equation[]
}

const buttonARegExp = /Button A: X\+(\d+), Y\+(\d+)/g
const buttonBRegExp = /Button B: X\+(\d+), Y\+(\d+)/g
const targetRegExp = /Prize: X=(\d+), Y=(\d+)/g

function parsePositionFrom(line: string, regExp: RegExp): Position2d {
  // Unsafe, but crashing is fine (error message is clear enough).
  // Afterthought: This is very ugly, and very unsafe! Why do matchAll, and match return such different results?
  const matches = Array.from(line.matchAll(regExp))[0]
  return {
    x: parseInt(matches[1]),
    y: parseInt(matches[2])
  }
}

function parseEquation(lines: string[]): Equation {
  // Unsafe again, but well...
  return {
    a: parsePositionFrom(lines[0], buttonARegExp),
    b: parsePositionFrom(lines[1], buttonBRegExp),
    target: parsePositionFrom(lines[2], targetRegExp)
  }
}

function parse(input: string): PuzzleInput {
  const equations = input
    .split("\n\n")
    .filter((block) => block !== "")
    .map(block => parseEquation(block.split("\n")))

  return {
    equations: equations
  }
}

/*
  The function solves a linear equation with two variables.
  We are solving r * x + s * y = t for the variables r and s, where x, y are two-dimensional vectors.
  There is a closed solution for such equations, so this is the implementation.
  The values originate from plugging in the inverse formula for a 2x2 matrix,
  and using the correct arguments everywhere.

  Also, since the solution needs to be integral, we need to check if the result is integral.
  Since that may not be the case, the result may be undefined.
 */
function solveEquation(equation: Equation): [bigint, bigint] | undefined {
  const denominatorR = equation.a.x * equation.b.y - equation.b.x * equation.a.y
  const numeratorR = equation.b.y * equation.target.x - equation.b.x * equation.target.y

  if (numeratorR % denominatorR === 0) {
    const r = numeratorR / denominatorR
    const numeratorS = equation.target.y - r * equation.a.y
    if (numeratorS % equation.b.y === 0) {
      const s = numeratorS / equation.b.y

      return [BigInt(r), BigInt(s)]
    } else return undefined
  } else return undefined
}

// The "cheapest" and the "at most 100 times" are red herrings for the first part.
function solve1(equations: Equation[]): bigint {
  const solutions =
    equations
      .map(solveEquation)
      .filter((solution) => solution !== undefined)
      .map(([r, s]) => {return 3n * r + s})

  return sum(solutions)
}

function solve(input: PuzzleInput): Solution<bigint> {
  return {
    part1: solve1(input.equations),
    part2: 0n
  }
}

function Day13() {
  return DayWith(
    "13",
    parse,
    solve
  )
}

export default Day13
