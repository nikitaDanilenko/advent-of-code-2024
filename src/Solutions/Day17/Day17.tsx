import { Solution } from '../Utils/Types.ts'
import DayWith from '../Utils/DayUtil.tsx'
import lodash from "lodash";

type PuzzleInput = Program

type Program = {
  instructionPosition: number,
  registers: [bigint, bigint, bigint],
  program: number[]
}

function parse(input: string): PuzzleInput {
  const lines = input.split('\n')
  const registers = lodash.take(lines, 3).map(line => BigInt(line.split(': ')[1]))

  // 4 lines are dropped, and 9 characters ("Program: ") are dropped in the program line.
  // Very specific to the input format, but fine for the task.
  const program = lines.slice(4)[0].slice(9).split(',').map(c => parseInt(c))

  return {
    instructionPosition: 0,
    registers: registers as [bigint, bigint, bigint],
    program: program
  }
}

function solve(input: PuzzleInput): Solution<bigint> {
  console.log(input)
  return {
    part1: BigInt(0),
    part2: BigInt(0)
  }
}

function Day17() {
  return DayWith('17', parse, solve)
}

export default Day17
