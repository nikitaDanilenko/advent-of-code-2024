import {Solution} from '../Utils/Types.ts'
import DayWith from '../Utils/DayUtil.tsx'
import lodash from "lodash";

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

function run(program: Program): System {

  const instructions = program.program

  function iterate(system: System): System {
    const instruction = instructions.at(system.instructionPointer)
    if (instruction === undefined)
      return system
    else {
      const literalOperand = instructions.at(system.instructionPointer + 1) !!
      const comboOperand = literalOperand < operandModulus ? BigInt(literalOperand) : system.registers.at(literalOperand % operandModulus)!!
      const nextSystem: () => System = () => {
        switch (instruction) {
          case 0:
            return adv(comboOperand, system)
          case 1:
            return bxl(BigInt(literalOperand), system)
          case 2:
            return bst(comboOperand, system)
          case 3:
            return jnz(BigInt(literalOperand), system)
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

  return iterate({registers: program.registers, instructionPointer: 0, output: []})
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
  const system = run(input)
  return {
    part1: system.output.map(o => o.toString()).join(','),
    part2: ''
  }
}

function Day17() {
  return DayWith('17', parse, solve)
}

export default Day17
