import DayWith from "../Utils/DayUtil.tsx";
import {Solution} from "../Utils/Types.ts";
import lodash from "lodash";
import {sum} from "../Utils/MathUtil.ts";

type PuzzleInput = {
  equations: Equation[]
}

type Equation = {
  target: bigint,
  operands: bigint[]
}

enum Operator {
  Add,
  Multiply,
  Concatenate
}

function operatorToFunction(op: Operator): (a: bigint, b: bigint) => bigint {
  switch (op) {
    case Operator.Add:
      return (a, b) => a + b
    case Operator.Multiply:
      return (a, b) => a * b
    case Operator.Concatenate:
      return (a, b) => BigInt(a.toString() + b.toString())
  }
}

function allOperators(n: number, allowedOperators: Operator[]): Operator[][] {
  function iterate(remaining: number, built: Operator[][]): Operator[][] {
    if (remaining === 0) {
      return built
    } else {
      return iterate(remaining - 1, built.flatMap(x => allowedOperators.map(op => [...x, op])))
    }
  }

  return iterate(n, [[]])
}

function validEquation(equation: Equation, operators: Operator[]): boolean {
  const rest = lodash.tail(equation.operands)
  const zipped = lodash
    .zipWith(lodash.take(operators, rest.length), rest, (x, y) => {
      return {first: x, second: y}
    })
    .reduce((acc, pair) => {
        return operatorToFunction(pair.first)(acc, pair.second)
      }
      , equation.operands[0])

  return zipped === equation.target
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
  const maxOperands = input.equations.map(x => x.operands.length).reduce((a, b) => Math.max(a, b)) - 1
  const allArithmeticOps = allOperators(maxOperands, [Operator.Add, Operator.Multiply])

  const [validEquations, invalidEquations] = lodash.partition(input.equations, (eq) => {
    return allArithmeticOps.some(ops => validEquation(eq, ops))
  })

  const validEquationsTargetsSum = sum(validEquations.map((equation) => equation.target))

  const allOps =
    allOperators(maxOperands, [Operator.Add, Operator.Multiply, Operator.Concatenate])
      .filter(ops => ops.some(op => op === Operator.Concatenate))

  console.log(allOps.length)

  const validEquationsWithConcatenation = invalidEquations.filter(eq => allOps.some(ops => validEquation(eq, ops)))
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
