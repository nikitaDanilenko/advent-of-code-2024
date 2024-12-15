import { Direction4, parseDirection4, Position2d, positionInDirection4, Solution } from '../Utils/Types.ts'
import DayWith from '../Utils/DayUtil.tsx'
import { StringPosition } from '../Utils/InputUtil.ts'
import { applyN, applyWhile } from '../Utils/MathUtil.ts'
import lodash from 'lodash'

type PuzzleInput = {
  map: ElementMap
  wideMap: WideElementMap
  width: number
  height: number
  robot: Position2d
  robotOnWidened: Position2d
  directions: Direction4[]
}


enum Element {
  Empty,
  Wall,
  Box
}

enum WideElement {
  Empty,
  Wall,
  BoxLeft,
  BoxRight
}

function parseWideElement(char: string): WideElement {
  switch (char) {
    case '#':
      return WideElement.Wall
    case '[':
      return WideElement.BoxLeft
    case ']':
      return WideElement.BoxRight
    default:
      return WideElement.Empty
  }
}

type WideElementMap = Map<StringPosition, WideElement>

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

  const widenedLines = lines.map(l => l.split('').map(c => {
      switch (c) {
        case 'O':
          return '[]'
        case '@':
          return '@.'
        default:
          return [c, c].join('')
      }
    }
  ).join(''))

  const widenedPositions = widenedLines.flatMap((line, y) => {
    return line.split('').map((char, x) => {
      return [{ x: x, y: y }, char] as [Position2d, string]
    })
  })

  const robotOnWidened = widenedPositions.find(([_, char]) => char === '@')!![0]
  const wideMap = new Map(
    widenedPositions.map(([position, char]) => {
      return [JSON.stringify(position), parseWideElement(char)]
    })
  )

  return {
    map: map,
    wideMap: wideMap,
    robot: robot,
    robotOnWidened: robotOnWidened,
    height: lines.length,
    width: lines[0].length,
    directions: directions
  }
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

function isHorizontal(direction: Direction4): boolean {
  return direction === Direction4.Left || direction === Direction4.Right
}

function isBoxElement(element: WideElement): boolean {
  return element === WideElement.BoxLeft || element === WideElement.BoxRight
}

function moveSequenceWidened(input: PuzzleInput): [WideElementMap, Position2d] {
  const map = new Map(input.wideMap)

  function boxNeighboursInDirection(position: Position2d, direction: Direction4): Position2d[] {
    if (isHorizontal(direction)) {
      // In the horizontal case, take all following neighbours in the same direction with box elements.
      const following = applyWhile(
        (pos) => {
          const e = map.get(JSON.stringify(pos))
          // Todo: Very ugly, seems unidiomatic.
          return !!e ? isBoxElement(e) : false
        },
        (pos) => positionInDirection4(pos, direction),
        position
      )
      return following
    } else {
      function iterateVertically(currentPositions: Position2d[], foundPositions: Position2d[]): Position2d[] {
        if (currentPositions.length === 0) {
          return foundPositions
        } else {
          const boxPositions = currentPositions.flatMap(pos => {
            const nextInDirection = positionInDirection4(pos, direction)
            const nextElement = map.get(JSON.stringify(nextInDirection))
            if (nextElement === undefined || !isBoxElement(nextElement)) {
              return []
            } else {
              const complementDirection = nextElement === WideElement.BoxLeft ? Direction4.Right : Direction4.Left
              const touchedBox = [nextInDirection, positionInDirection4(nextInDirection, complementDirection)]
              const filtered = touchedBox.filter(p => {
                const atP = map.get(JSON.stringify(p))
                return atP !== undefined && isBoxElement(atP)
              })
              return filtered
            }
          })
          return iterateVertically(boxPositions, foundPositions.concat(boxPositions))
        }
      }

      const elementAtPosition = map.get(JSON.stringify(position))
      const complementDirection = elementAtPosition === WideElement.BoxLeft ? Direction4.Right : Direction4.Left

      const initial = [position, positionInDirection4(position, complementDirection)]
      return iterateVertically(initial, initial)
    }
  }

  function move(position: Position2d, direction: Direction4): Position2d {
    const targetPosition = positionInDirection4(position, direction)
    const targetElement = map.get(JSON.stringify(targetPosition))!!

    if (targetElement === WideElement.Wall) {
      return position
    } else if (targetElement === WideElement.Empty) {
      return targetPosition
    } else {
      const boxPositions = boxNeighboursInDirection(targetPosition, direction)

      const allMovable = lodash.every(
        boxPositions,
        pos => {
          const nextPos = positionInDirection4(pos, direction)
          const nextElement = map.get(JSON.stringify(nextPos))
          // Careful: Cannot check '!!nextElement' here, because WideElement.Empty is falsy.
          // How can people seriously work with this language?
          const result = nextElement !== undefined && (nextElement === WideElement.Empty || isBoxElement(nextElement))
          return result
        }
      )
      if (allMovable) {
        const stringPositions = boxPositions.map(p => JSON.stringify(p))
        const currentElements = boxPositions.map(p => [p, map.get(JSON.stringify(p))!!] as [Position2d, WideElement])
        // Delete old values
        stringPositions.forEach(pos => {
          map.set(pos, WideElement.Empty)
        })
        // Set new values
        currentElements.forEach(([pos, el]) => {
          const nextPos = positionInDirection4(pos, direction)
          map.set(JSON.stringify(nextPos), el)
        })

        return targetPosition
      } else {
        return position
      }
    }
  }

  const result = input.directions.reduce<Position2d>(
    (acc, direction) => {
      return move(acc, direction)
    }, input.robotOnWidened
  )

  return [map, result]
}

function solve(input: PuzzleInput): Solution<bigint> {

  const [map] = moveSequence(input)
  const boxPositions = Array
    .from(map.entries())
    .map(([p, e]) => [JSON.parse(p), e] as [Position2d, Element])
    .filter(([_, e]) => e === Element.Box)
  const solution1 = lodash.sum(boxPositions
    .map(([p, _]) => p.x + p.y * 100)
  )

  const [wideMap] = moveSequenceWidened(input)

  const leftBoxParts = Array
    .from(wideMap.entries())
    .map(([p, e]) => [JSON.parse(p), e] as [Position2d, WideElement])
    .filter(([_, e]) => e === WideElement.BoxLeft)

  const solution2 = lodash.sum(leftBoxParts
    .map(([p, _]) => p.x + p.y * 100)
  )
  // printMap(wideMap, input.robotOnWidened, input.width, input.height)

  return {
    part1: BigInt(solution1),
    part2: BigInt(solution2)
  }
}

function Day15() {
  return DayWith('15', parse, solve)
}

export default Day15
