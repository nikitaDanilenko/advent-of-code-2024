import { Solution } from '../Utils/Types.ts'
import DayWith from '../Utils/DayUtil.tsx'
import lodash from 'lodash'
import { sum } from '../Utils/MathUtil.ts'

type PuzzleInput = NumPad[][]

enum NumPad {
  Zero = '0',
  One = '1',
  Two = '2',
  Three = '3',
  Four = '4',
  Five = '5',
  Six = '6',
  Seven = '7',
  Eight = '8',
  Nine = '9',
  A = 'A'
}

function parseNumPad(s: string): NumPad {
  switch (s) {
    case NumPad.Zero:
      return NumPad.Zero
    case NumPad.One:
      return NumPad.One
    case NumPad.Two:
      return NumPad.Two
    case NumPad.Three:
      return NumPad.Three
    case NumPad.Four:
      return NumPad.Four
    case NumPad.Five:
      return NumPad.Five
    case NumPad.Six:
      return NumPad.Six
    case NumPad.Seven:
      return NumPad.Seven
    case NumPad.Eight:
      return NumPad.Eight
    case NumPad.Nine:
      return NumPad.Nine
    default:
      return NumPad.A
  }
}

enum Directional {
  Up = '^',
  Down = 'v',
  Left = '<',
  Right = '>',
  A = 'A'
}

function parseDirectional(s: string): Directional {
  switch (s) {
    case Directional.Up:
      return Directional.Up
    case Directional.Down:
      return Directional.Down
    case Directional.Left:
      return Directional.Left
    case Directional.Right:
      return Directional.Right
    default:
      return Directional.A
  }
}

type Arrow = {
  from: string
  to: string
  directions: Directional[]
}

type StringArrow = {
  from: string
  to: string
  directions: string
}

function parseArrow(stringArrow: StringArrow): Arrow {
  return {
    from: stringArrow.from,
    to: stringArrow.to,
    directions: stringArrow.directions.split('').map(parseDirectional)
  }
}

/**
 * This was not the best decision in retrospect.
 * We need not only just shortest paths, but those *with respect to the directional pad*.
 *
 * There are two good heuristics to match those:
 * 1. Group identical directions when possible
 * 2. The end symbol matters a lot, because after that we usually go to an A,
 *    and being close to A is beneficial. This gives the following order of preferences *when possible*
 *    * Up, Right
 *    * Down
 *    * Left
 *
 *    Keep in mind that the first rule is important, and takes precedence, for instance for the path 4 -> A.
 *    We have >>vv as the path. One could take >vv>, meaning that the ending would be good,
 *    but keeping the number of directional changes is more important!
 */
const numPadArrows = [
  { from: '0', to: '1', directions: '<^' },
  { from: '0', to: '2', directions: '^' },
  { from: '0', to: '3', directions: '^>' },
  { from: '0', to: '4', directions: '^^<' },
  { from: '0', to: '5', directions: '^^' },
  { from: '0', to: '6', directions: '>^^' },
  { from: '0', to: '7', directions: '^^^<' },
  { from: '0', to: '8', directions: '^^^' },
  { from: '0', to: '9', directions: '^^^>' },
  { from: '0', to: 'A', directions: '>' },

  { from: '1', to: '0', directions: '>v' },
  { from: '1', to: '2', directions: '>' },
  { from: '1', to: '3', directions: '>>' },
  { from: '1', to: '4', directions: '^' },
  { from: '1', to: '5', directions: '^>' },
  { from: '1', to: '6', directions: '^>>' },
  { from: '1', to: '7', directions: '^^' },
  { from: '1', to: '8', directions: '^^>' },
  { from: '1', to: '9', directions: '^^>>' },
  { from: '1', to: 'A', directions: '>>v' },

  { from: '2', to: '0', directions: 'v' },
  { from: '2', to: '1', directions: '<' },
  { from: '2', to: '3', directions: '>' },
  { from: '2', to: '4', directions: '<^' },
  { from: '2', to: '5', directions: '^' },
  { from: '2', to: '6', directions: '^>' },
  { from: '2', to: '7', directions: '<^^' },
  { from: '2', to: '8', directions: '^^' },
  { from: '2', to: '9', directions: '^^>' },
  { from: '2', to: 'A', directions: 'v>' },

  { from: '3', to: '0', directions: '<v' },
  { from: '3', to: '1', directions: '<<' },
  { from: '3', to: '2', directions: '<' },
  { from: '3', to: '4', directions: '<<^' },
  { from: '3', to: '5', directions: '<^' },
  { from: '3', to: '6', directions: '^' },
  { from: '3', to: '7', directions: '<<^^' },
  { from: '3', to: '8', directions: '<^^' },
  { from: '3', to: '9', directions: '^^' },
  { from: '3', to: 'A', directions: 'v' },

  { from: '4', to: '0', directions: '>vv' },
  { from: '4', to: '1', directions: 'v' },
  { from: '4', to: '2', directions: 'v>' },
  { from: '4', to: '3', directions: 'v>>' },
  { from: '4', to: '5', directions: '>' },
  { from: '4', to: '6', directions: '>>' },
  { from: '4', to: '7', directions: '^' },
  { from: '4', to: '8', directions: '^>' },
  { from: '4', to: '9', directions: '^>>' },
  { from: '4', to: 'A', directions: '>>vv' },

  { from: '5', to: '0', directions: 'vv' },
  { from: '5', to: '1', directions: '<v' },
  { from: '5', to: '2', directions: 'v' },
  { from: '5', to: '3', directions: 'v>' },
  { from: '5', to: '4', directions: '<' },
  { from: '5', to: '6', directions: '>' },
  { from: '5', to: '7', directions: '<^' },
  { from: '5', to: '8', directions: '^' },
  { from: '5', to: '9', directions: '^>' },
  { from: '5', to: 'A', directions: 'vv>' },

  { from: '6', to: '0', directions: '<vv' },
  { from: '6', to: '1', directions: '<<v' },
  { from: '6', to: '2', directions: '<v' },
  { from: '6', to: '3', directions: 'v' },
  { from: '6', to: '4', directions: '<<' },
  { from: '6', to: '5', directions: '<' },
  { from: '6', to: '7', directions: '<<^' },
  { from: '6', to: '8', directions: '<^' },
  { from: '6', to: '9', directions: '^' },
  { from: '6', to: 'A', directions: 'vv' },

  { from: '7', to: '0', directions: '>vvv' },
  { from: '7', to: '1', directions: 'vv' },
  { from: '7', to: '2', directions: 'vv>' },
  { from: '7', to: '3', directions: 'vv>>' },
  { from: '7', to: '4', directions: 'v' },
  { from: '7', to: '5', directions: 'v>' },
  { from: '7', to: '6', directions: 'v>>' },
  { from: '7', to: '8', directions: '>' },
  { from: '7', to: '9', directions: '>>' },
  { from: '7', to: 'A', directions: '>>vvv' },

  { from: '8', to: '0', directions: 'vvv' },
  { from: '8', to: '1', directions: '<vv' },
  { from: '8', to: '2', directions: 'vv' },
  { from: '8', to: '3', directions: 'vv>' },
  { from: '8', to: '4', directions: '<v' },
  { from: '8', to: '5', directions: 'v' },
  { from: '8', to: '6', directions: 'v>' },
  { from: '8', to: '7', directions: '<' },
  { from: '8', to: '9', directions: '>' },
  { from: '8', to: 'A', directions: 'vvv>' },

  { from: '9', to: '0', directions: '<vvv' },
  { from: '9', to: '1', directions: '<<vv' },
  { from: '9', to: '2', directions: '<vv' },
  { from: '9', to: '3', directions: 'vv' },
  { from: '9', to: '4', directions: '<<v' },
  { from: '9', to: '5', directions: '<v' },
  { from: '9', to: '6', directions: 'v' },
  { from: '9', to: '7', directions: '<<' },
  { from: '9', to: '8', directions: '<' },
  { from: '9', to: 'A', directions: 'vvv' },

  { from: 'A', to: '0', directions: '<' },
  { from: 'A', to: '1', directions: '^<<' },
  { from: 'A', to: '2', directions: '<^' },
  { from: 'A', to: '3', directions: '^' },
  { from: 'A', to: '4', directions: '^^<<' },
  { from: 'A', to: '5', directions: '^^<' },
  { from: 'A', to: '6', directions: '^^' },
  { from: 'A', to: '7', directions: '^^^<<' },
  { from: 'A', to: '8', directions: '<^^^' },
  { from: 'A', to: '9', directions: '^^^' }
].map(parseArrow)

const numPadDirectionsMap = new Map(
  numPadArrows.map(a => [a.from + a.to, a.directions])
)

const directionalArrows = [
  { from: '<', to: '^', directions: '>^' },
  { from: '<', to: 'v', directions: '>' },
  { from: '<', to: '>', directions: '>>' },
  { from: '<', to: 'A', directions: '>>^' },

  { from: '^', to: '<', directions: 'v<' },
  { from: '^', to: 'v', directions: 'v' },
  { from: '^', to: '>', directions: 'v>' },
  { from: '^', to: 'A', directions: '>' },

  { from: 'v', to: '<', directions: '<' },
  { from: 'v', to: '^', directions: '^' },
  { from: 'v', to: '>', directions: '>' },
  { from: 'v', to: 'A', directions: '>^' },

  { from: '>', to: '<', directions: '<<' },
  { from: '>', to: '^', directions: '^<' },
  { from: '>', to: 'v', directions: '<' },
  { from: '>', to: 'A', directions: '^' },

  { from: 'A', to: '<', directions: 'v<<' },
  { from: 'A', to: '^', directions: '<' },
  { from: 'A', to: 'v', directions: 'v<' },
  { from: 'A', to: '>', directions: 'v' }

].map(parseArrow)

const directionalDirectionsMap = new Map(
  directionalArrows.map(a => [a.from + a.to, a.directions])
)

function directionsNumPad(from: NumPad, to: NumPad): Directional[] {
  const base = numPadDirectionsMap.get(from + to) ?? []

  return [...base, Directional.A]
}

function directionsDirectional(from: Directional, to: Directional): Directional[] {
  const base = directionalDirectionsMap.get(from + to) ?? []
  return [...base, Directional.A]
}

function unwrapNumpad(nums: NumPad[]): Directional[] {
  const expanded = [NumPad.A, ...nums]
  const commands = lodash.zipWith(
    lodash.initial(expanded),
    nums,
    (from, to) => directionsNumPad(from, to)
  )
  return lodash.flatten(commands)
}

function unwrapDirectional(directions: Directional[]): Directional[] {
  const expanded = [Directional.A, ...directions]
  const commands = lodash.zipWith(
    lodash.initial(expanded),
    directions,
    (from, to) => directionsDirectional(from, to)
  )
  return lodash.flatten(commands)
}

function parse(input: string): PuzzleInput {
  return input
    .split('\n')
    .filter(l => l.length > 0)
    .map(l => l.split('').map(parseNumPad))
}

function unwrapPart1(input: PuzzleInput): bigint {
  const values = input.map(numpad => {
    const firstIndirection = unwrapNumpad(numpad)
    const secondIndirection = unwrapDirectional(firstIndirection)
    const thirdIndirection = unwrapDirectional(secondIndirection)
    const length = BigInt(thirdIndirection.length)
    const numeric = BigInt(lodash.takeWhile(numpad, n => n !== NumPad.A).join(''))
    return length * numeric
  })

  return sum(values)
}

function solve(input: PuzzleInput): Solution<bigint> {
  const part1 = unwrapPart1(input)
  return {
    part1: part1,
    part2: BigInt(0)
  }
}

function Day21() {
  return DayWith('21', parse, solve)
}

export default Day21

