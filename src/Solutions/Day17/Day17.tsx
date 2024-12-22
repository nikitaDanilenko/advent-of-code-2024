import { Solution } from '../Utils/Types.ts'
import DayWith from '../Utils/DayUtil.tsx'
import lodash from 'lodash'
import { min } from '../Utils/MathUtil.ts'

type PuzzleInput = Program

type Program = {
  registers: Registers
  program: number[]
}

type Registers = [bigint, bigint, bigint]

function parse(input: string): PuzzleInput {
  const lines = input.split('\n')
  const registers = lodash.take(lines, 3).map(line => BigInt(line.split(': ')[1]))

  // 4 lines are dropped, and 9 characters ("Program: ") are dropped in the program line.
  // Very specific to the input format, but fine for the task.
  const program = lines.slice(4)[0].slice(9).split(',').map(c => parseInt(c))

  return {
    registers: registers as [bigint, bigint, bigint],
    program: program
  }
}

const operandModulus: number = 4
const valueModulus: bigint = 8n

function run(program: Program, ignoreJump: boolean): System {
  const instructions = program.program

  function iterate(system: System): System {
    const instruction = instructions.at(system.instructionPointer)
    if (instruction === undefined)
      return system
    else {
      const literalOperand = instructions.at(system.instructionPointer + 1) !
      const comboOperand = literalOperand < operandModulus ? BigInt(literalOperand) : system.registers.at(literalOperand % operandModulus)!
      const nextSystem: () => System = () => {
        switch (instruction) {
          case 0:
            return adv(comboOperand, system)
          case 1:
            return bxl(BigInt(literalOperand), system)
          case 2:
            return bst(comboOperand, system)
          // Hard-coded assumption: We loop only once from the end.
          // The assumption is true for my input,
          // and seems to be true for the inputs discussed on Reddit.
          case 3:
            if (!ignoreJump)
              return jnz(BigInt(literalOperand), system)
            else
              // The system stays the same, but we need to move the pointer to reach the end of the program.
              return { ...system, instructionPointer: system.instructionPointer + 2 }
          case 4:
            return bxc(system)
          case 5:
            return out(comboOperand, system)
          case 6:
            return bdv(comboOperand, system)
          default:
            return cdv(comboOperand, system)
        }
      }
      const next = nextSystem()
      return iterate(next)
    }
  }

  return iterate({ registers: program.registers, instructionPointer: 0, output: [] })
}

type System = {
  registers: Registers
  instructionPointer: number
  output: bigint[]
}

function adv(value: bigint, system: System): System {
  return {
    output: system.output,
    instructionPointer: system.instructionPointer + 2,
    registers: [system.registers[0] / (BigInt(2) ** value), system.registers[1], system.registers[2]]
  }
}

function bxl(value: bigint, system: System): System {
  // ^ is the bitwise XOR operator
  return {
    output: system.output,
    instructionPointer: system.instructionPointer + 2,
    registers: [system.registers[0], system.registers[1] ^ value, system.registers[2]]
  }
}

function bst(value: bigint, system: System): System {
  return {
    output: system.output,
    instructionPointer: system.instructionPointer + 2,
    registers: [system.registers[0], value % valueModulus, system.registers[2]]
  }
}

function jnz(value: bigint, system: System): System {
  if (system.registers[0] === BigInt(0))
    return {
      output: system.output,
      registers: system.registers,
      instructionPointer: system.instructionPointer + 2
    }
  else
    return {
      output: system.output,
      registers: system.registers,
      instructionPointer: Number(value)
    }
}

function bxc(system: System): System {
  return {
    output: system.output,
    instructionPointer: system.instructionPointer + 2,
    registers: [system.registers[0], system.registers[1] ^ system.registers[2], system.registers[2]]
  }
}

function out(value: bigint, system: System): System {
  return {
    registers: system.registers,
    instructionPointer: system.instructionPointer + 2,
    output: [...system.output, value % valueModulus]
  }
}

function bdv(value: bigint, system: System): System {
  return {
    output: system.output,
    instructionPointer: system.instructionPointer + 2,
    registers: [system.registers[0], system.registers[0] / (BigInt(2) ** value), system.registers[2]]
  }
}

function cdv(value: bigint, system: System): System {
  return {
    output: system.output,
    instructionPointer: system.instructionPointer + 2,
    registers: [system.registers[0], system.registers[1], system.registers[0] / (BigInt(2) ** value)]
  }
}

function solve(input: PuzzleInput): Solution<string> {
  const system = run(input, false)

  // Assumption: Only one output is produced.
  function runOnce(valueForRegisterA: bigint): bigint {
    const system = run({ registers: [valueForRegisterA, 0n, 0n], program: input.program }, true)
    return system.output[0]
  }

  // Heavily inspired by discussions on Reddit.

  // Intended to be used for a traversal from the back.
  function findOne(valueForRegisterA: bigint, index: number, options: bigint[]): bigint[] {
    if (runOnce(valueForRegisterA) !== BigInt(input.program[index])) {
      // Not a match, return the current options.
      return options
    } else if (index === 0) {
      // The output value matches the value in the program at the index (0),
      // so we have found a match.
      return [valueForRegisterA, ...options]
    } else {
      // For each index from the back to the front,
      // the order of valueForRegisterA grows.
      // Normally, the base is 10, which also works,
      // but since all use the base 8, using base 8 is slightly faster.
      // The important part is that regardless of the next index,
      // any value for the next index will still produce the same output.
      return lodash
        .range(0, 8)
        .reduce((acc, nextPositionMod8) =>
            findOne(
              valueForRegisterA * valueModulus + BigInt(nextPositionMod8),
              index - 1,
              acc
            )
          ,
          options)
    }
  }

  const start = input.program.length - 1
  const all =
    lodash
      .range(0, 8)
      .reduce(
        (options, firstPositionMod8) => findOne(BigInt(firstPositionMod8), start, options),
        [] as bigint[]
      )

  const part2 = min(all)!

  return {
    part1: system.output.map(o => o.toString()).join(','),
    part2: part2.toString()
  }
}

function Day17() {
  return DayWith('17', parse, solve)
}

export default Day17
