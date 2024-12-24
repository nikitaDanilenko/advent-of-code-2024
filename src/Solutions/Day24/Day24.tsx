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

type Output = {
  name: string
  value: boolean
}

function evaluateGate(gate: Gate, input1: boolean, input2: boolean): Output {
  const result = () => {
    switch (gate.operation) {
      case Operation.AND:
        return input1 && input2
      case Operation.OR:
        return input1 || input2
      default:
        return input1 !== input2
    }
  }
  return {
    name: gate.output,
    value: result()
  }
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


function process(input: PuzzleInput): bigint {

  function processOnce(wires: Map<string, boolean>, gates: Gate[]): [Map<string, boolean>, boolean] {
    const newWires = new Map(wires)
    let changed = false
    gates.forEach(gate => {
      const input1 = wires.get(gate.input1)
      const input2 = wires.get(gate.input2)
      if (input1 !== undefined && input2 !== undefined) {
        const output = evaluateGate(gate, input1, input2)
        newWires.set(output.name, output.value)
        // There is a "no loop" condition, i.e. the value of a wire will never be overwritten.
        changed = newWires.size > wires.size
      }
    })
    return [newWires, changed]
  }

  let wires = new Map(input.initialValues.map(iv => [iv.name, iv.value]))
  let unfinished = true

  while (unfinished) {
    const [newWires, changed] = processOnce(wires, input.gates)
    wires = newWires
    unfinished = changed
  }

  const binary = Array
    .from(wires.entries())
    .filter(([name]) => name.startsWith('z'))
    .sort(([name1], [name2]) => name1 > name2 ? -1 : name1 === name2 ? 0 : 1)
    .map(([_, value]) => value ? '1' : '0')
    .join('')

  return BigInt(`0b${binary}`)
}

function solve(input: PuzzleInput): Solution<bigint> {
  const part1 = process(input)

  return {
    part1: part1,
    part2: BigInt(0)
  }
}

function Day24() {
  return DayWith('24', parse, solve)
}

export default Day24
