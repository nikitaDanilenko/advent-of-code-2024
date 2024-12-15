import { Direction4, parseDirection4, Position2d, positionInDirection4, Solution } from '../Utils/Types.ts'
import DayWith from '../Utils/DayUtil.tsx'
import { StringPosition } from '../Utils/InputUtil.ts'
import { applyN } from '../Utils/MathUtil.ts'
import lodash from 'lodash'

type PuzzleInput = {
  map: ElementMap
  width: number
  height: number
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
  const lines = blocks[0].split('\n')
  const positions = lines
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

  return { map: map, robot: robot, height: lines.length, width: lines[0].length, directions: directions }
}

function printMap(map: ElementMap, robot: Position2d, width: number, height: number) {
  const lines: string[] = []
  lodash.range(height).forEach(y => {
    const line: string[] = []
    lodash.range(width).forEach(x => {
      const position = { x: x, y: y }
      const element = map.get(JSON.stringify(position))

      if (element === Element.Wall) {
        line.push('#')
      } else if (element === Element.Box) {
        line.push('O')
      } else if (element === Element.Empty) {
        line.push('.')
      } else {
        line.push('?')
      }
    })
    if (y === robot.y) {
      line[robot.x] = '@'
    }
    lines.push(line.join(''))
  })
  console.log(lines.join('\n'))
}

function moveSequence(input: PuzzleInput): [ElementMap, Position2d] {
  const map = new Map(input.map)

  function move(position: Position2d, direction: Direction4): Position2d {
    const targetPosition = positionInDirection4(position, direction)
    const targetElement = map.get(JSON.stringify(targetPosition))!!

    if (targetElement === Element.Wall) {
      return position
    } else if (targetElement === Element.Empty) {
      return targetPosition
    } else {
      // Overestimation, there are a lot less options on average.
      const nextPositions = applyN<Position2d>(input.width, p => positionInDirection4(p, direction), targetPosition)
      const boxes = lodash.takeWhile(
        nextPositions
          .map(p => [p, map.get(JSON.stringify(p))] as [Position2d, Element])
          // Morally unnecessary, but there is no way for the type system to know that.
          .filter(([, e]) => e !== undefined),
        ([, e]) => e === Element.Box
      )
      const positionAfterBox = positionInDirection4(lodash.last(boxes)!![0], direction)
      const elementAfterBox = map.get(JSON.stringify(positionAfterBox))!!
      if (elementAfterBox === Element.Wall) {
        return position
      }
      // There are only two cases here, because all boxes have been collected in the boxes array.
      else {
        // Todo: This could be done in one iteration, but with a bit more logic
        boxes.forEach(([p]) => map.set(JSON.stringify(p), Element.Empty))
        lodash.tail(boxes).forEach(([p]) => map.set(JSON.stringify(p), Element.Box))
        map.set(JSON.stringify(positionAfterBox), Element.Box)
        return targetPosition
      }
    }
  }

  const result = input.directions.reduce<Position2d>(
    (acc, direction) => {
      return move(acc, direction)
    }, input.robot
  )

  return [map, result]
}

function solve(input: PuzzleInput): Solution<bigint> {

  const [map] = moveSequence(input)
  const boxPositions = Array
    .from(map.entries())
    .map(([p, e]) => [JSON.parse(p) as Position2d, e] as [Position2d, Element])
    .filter(([_, e]) => e === Element.Box)
  const solution1 = lodash.sum(boxPositions
    .map(([p, _]) => p.x + p.y * 100))


  return {
    part1: BigInt(solution1),
    part2: BigInt(0)
  }
}

function Day15() {
  return DayWith('15', parse, solve)
}

export default Day15
