import { Solution } from '../Utils/Types.ts'
import DayWith from '../Utils/DayUtil.tsx'
import lodash from 'lodash'

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

  const gates = gatesBlock
    .split('\n')
    .filter(line => line !== '')
    .map(line => {
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
    .map(([_, value]) => toBit(value))
    .join('')

  return BigInt(`0b${binary}`)
}

function toBit(bool: boolean): string {
  return bool ? '1' : '0'
}


/* This is a terrible solution, but it works for my input.
   However, one can come up with different conditions that need to be satisfied.
   Complementary, it is not clear, why the conditions chosen here are sufficient.

   The solution is based on a lot of assumptions.
   Yes, these assumptions are satisfied here, but surely there are other, less elegant ways of adding numbers.


 */
function findMismatches(input: PuzzleInput): string[] {
  // The number is one higher than the maximum index of the inputs,
  // but the output can have one bit more!
  const maxResultIndex = input.initialValues.length / 2

  /*
     Assumption: The schematic should be a ripple-carry adder.
     In that case we have:
     result = input1 XOR input2 XOR carry
     newCarry = (input1 AND input2) OR (carry AND (input1 XOR input2))
   */

  // Every output needs to be the result of an XOR operation (see definition of 'result')
  const zMismatches = input.gates
    .filter(gate => {
      // Assumption: z prefixes are only used for the outputs
      return gate.operation !== Operation.XOR && gate.output.startsWith('z') && gate.output !== `z${maxResultIndex}`
    })
    .map(gate => gate.output)

  const isXyGate = (gate: Gate) => (gate.input1.startsWith('x') && gate.input2.startsWith('y')) || (gate.input1.startsWith('y') && gate.input2.startsWith('x'))

  // Every XOR operation either takes x, y values or outputs a z value.
  const xorMismatches = input.gates
    .filter(gate => {
      return gate.operation === Operation.XOR && !isXyGate(gate) && !gate.output.startsWith('z')
    })
    .map(gate => gate.output)

  const orInputMismatches = input.gates
    .filter(gate => gate.operation === Operation.OR)
    .flatMap(gate => {
      const inputOperations = input.gates
        .filter(g => g.output === gate.input1 || g.output === gate.input2)
      const wrong = inputOperations.filter(g => g.operation !== Operation.AND)
      return wrong
    })
    .map(gate => gate.output)

  // Any 'AND' output is connected to an 'OR' gate, see the definition of 'newCarry'.
  // The exception is the first carry, because that is computed directly from the inputs.
  const andOutputMismatches = input.gates
    // Double filter only for clarity, because the condition is involved.
    .filter(gate => gate.operation === Operation.AND)
    .filter(gate => {
      const wrong = input.gates.some(g => {
        return (g.input1 === gate.output || g.input2 === gate.output) && g.operation !== Operation.OR
      })
      return !((gate.input1 === 'x00' && gate.input2 === 'y00') || (gate.input1 === 'y00' && gate.input2 === 'x00')) && wrong
    })
    .map(gate => gate.output)

  return lodash.uniq([...zMismatches, ...xorMismatches, ...orInputMismatches, ...andOutputMismatches])
}

function solve(input: PuzzleInput): Solution<string> {
  const part1 = process(input)
  const mismatches = findMismatches(input).sort().join(',')

  return {
    part1: part1.toString(),
    part2: mismatches
  }
}

function Day24() {
  return DayWith('24', parse, solve)
}

export default Day24
