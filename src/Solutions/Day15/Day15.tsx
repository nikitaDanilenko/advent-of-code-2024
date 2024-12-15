import { Direction4, parseDirection4, Position2d, Solution } from '../Utils/Types.ts'
import DayWith from '../Utils/DayUtil.tsx'
import { StringPosition } from '../Utils/InputUtil.ts'

type PuzzleInput = {
  map: ElementMap
  robot: Position2d
  directions: Direction4[]
}

enum Element {
  Empty,
  Wall,
  Box
}

function parseElement(char: string): Element {
  switch (char) {
    case '#':
      return Element.Wall
    case 'O':
      return Element.Box
    default:
      return Element.Empty
  }
}


type ElementMap = Map<StringPosition, Element>

function parse(input: string): PuzzleInput {
  const blocks = input.split('\n\n')
  const positions = blocks[0]
    .split('\n')
    .flatMap((line, y) => {
      return line.split('').map((char, x) => {
        return [{ x: x, y: y }, char] as [Position2d, string]
      })
    })
  const robot = positions.find(([_, char]) => char === '@')!![0]
  const map = new Map(
    positions.map(([position, char]) => {
      return [JSON.stringify(position), parseElement(char)]
    })
  )
  const directions = blocks[1]
    .split('\n')
    .flatMap(l => l.split(''))
    .map(c => parseDirection4('^', '>', 'v', '<', c))

  return { map: map, robot: robot, directions: directions }
}

function solve(input: PuzzleInput): Solution<bigint> {
  console.log(input)
  return {
    part1: BigInt(0),
    part2: BigInt(0)
  }
}

function Day15() {
  return DayWith('15', parse, solve)
}

export default Day15
