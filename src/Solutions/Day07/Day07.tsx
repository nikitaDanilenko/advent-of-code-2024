import DayWith from "../Utils/DayUtil.tsx";
import {Solution} from "../Utils/Types.ts";
import lodash from "lodash";
import {sum} from "../Utils/MathUtil.ts";
import {foldrM} from "../Utils/CollectionUtil.ts";

type PuzzleInput = {
  equations: Equation[]
}

type Equation = {
  target: bigint,
  operands: bigint[]
}

function invertAddition(operand: bigint, target: bigint): bigint | undefined {
  return target >= operand ? target - operand : undefined
}

function invertMultiplication(operand: bigint, target: bigint): bigint | undefined {
  return target % operand === BigInt(0) ? target / operand : undefined
}

function invertConcatenation(operand: bigint, target: bigint): bigint | undefined {
  const operandString = operand.toString()
  const targetString = target.toString()
  if (targetString.endsWith(operandString)) {
    return BigInt(lodash.dropRight(targetString.split(""), operandString.length).join(""))
  } else {
    return undefined
  }
}

const arithmeticInverters = [invertAddition, invertMultiplication]
const allInverters = [invertAddition, invertMultiplication, invertConcatenation]

function validEquation(equation: Equation, inverters: ((x: bigint, target: bigint) => bigint | undefined)[]): boolean {

  function outcomes(x: bigint, y: bigint): bigint[] {
    return inverters
      .map(inverter => inverter(x, y))
      .filter(x => x !== undefined)
  }

  // Attempt to iterate backward: Starting from the target, apply the inverse of all available operations to the target,
  // and the right-most operand.
  // Doing this iteratively, we reach a list of values after all inverses have been applied.
  // Now, we check if the list contains 0. One could save an extra operation,
  // because the last decomposition is only relevant if it leads to a zero,
  // i.e. one could also use 'tail(equation.operands)' and compare to 'equation.operands[0]'.
  const options = foldrM(outcomes, equation.target, equation.operands)

  return options.some(x => x === BigInt(0))
}

function parseInput(text: string): PuzzleInput {
  const equations = text.split("\n").filter(x => x.length > 0).map(line => {
    const [target, rest] = line.split(": ")
    const operands = rest.split(" ").map(x => BigInt(x))
    return {
      target: BigInt(target),
      operands
    }
  })
  return {equations: equations}
}

function solve(input: PuzzleInput): Solution<bigint> {
  const [validEquations, invalidEquations] = lodash.partition(input.equations, (eq) => {
    return validEquation(eq, arithmeticInverters)
  })

  const validEquationsTargetsSum = sum(validEquations.map((equation) => equation.target))

  const validEquationsWithConcatenation = invalidEquations.filter(equation => validEquation(equation, allInverters))
  const validEquationsWithConcatenationTargetsSum = sum(validEquationsWithConcatenation.map((equation) => equation.target))

  return {
    part1: validEquationsTargetsSum,
    part2: validEquationsTargetsSum + validEquationsWithConcatenationTargetsSum
  }
}

function Day07() {
  return DayWith<PuzzleInput>(
    "07",
    parseInput,
    solve
  )
}

export default Day07
