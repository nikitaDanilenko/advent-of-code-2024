import {Position2d, Solution} from "../Utils/Types.ts"
import DayWith from "../Utils/DayUtil.tsx"

type Equation = {
  a: Position2d,
  b: Position2d,
  target: Position2d
}

type PuzzleInput = {
  equations: Equation[]
}

const buttonARegExp = /Button A: X+(\d+), Y+(\d+)/g
const buttonBRegExp = /Button B: X+(\d+), Y+(\d+)/g
const targetRegExp = /Prize: X=(\d+), Y=(\d+)/g

function parsePositionFrom(line: string, regExp: RegExp): Position2d {
  // Unsafe, but crashing is fine (error message is clear enough)
  const matches = line.match(regExp)!!
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

function solve(input: PuzzleInput): Solution<bigint> {
  return {
    part1: 0n,
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
