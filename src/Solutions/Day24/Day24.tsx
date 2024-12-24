import { Solution } from '../Utils/Types.ts'
import DayWith from '../Utils/DayUtil.tsx'

type PuzzleInput = {
  initialValues: InitialValue[]
  gates: Gate[]
}

type InitialValue = {
  name: string
  value: boolean
}

type Gate = {
  input1: string
  input2: string
  output: string,
  operation: Operation
}

enum Operation {
  AND = 'AND',
  OR = 'OR',
  XOR = 'XOR'
}

function parseOperation(string: string): Operation {
  switch (string) {
    case Operation.AND:
      return Operation.AND
    case Operation.OR:
      return Operation.OR
    default:
      return Operation.XOR
  }
}

function parse(input: string): PuzzleInput {
  const [initialValuesBlock, gatesBlock] = input.split('\n\n')

  const initialValues = initialValuesBlock.split('\n').map(line => {
    const [name, value] = line.split(': ')
    return {
      name: name,
      value: value === '1'
    }
  })

  const gates = gatesBlock.split('\n').map(line => {
    const [inputs, output] = line.split(' -> ')
    const [input1, operation, input2] = inputs.split(' ')
    return {
      input1: input1,
      input2: input2,
      output: output,
      operation: parseOperation(operation)
    }
  })

  return {
    initialValues: initialValues,
    gates: gates
  }
}

function solve(input: PuzzleInput): Solution<bigint> {
  console.log(input)
  return {
    part1: BigInt(0),
    part2: BigInt(0)
  }
}

function Day24() {
  return DayWith('24', parse, solve)
}

export default Day24
