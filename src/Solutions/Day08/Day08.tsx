import DayWith from "../Utils/DayUtil.tsx"
import { Position2d } from "../Utils/Types.ts"
import lodash from "lodash"
import { applyN } from "../Utils/MathUtil.ts"

type StringPosition2d = string

type PuzzleInput = {
  map: Map<StringPosition2d, string>
  height: number
  width: number
}

function parse(input: string): PuzzleInput {
  const lines = input.split("\n").filter((line) => line !== "")
  const height = lines.length
  const width = lines[0].length

  const entries = input
    .split("\n")
    .filter((line) => line !== "")
    .flatMap((line, y) => {
      return line.split("").map((char, x) => {
        const position = { x: x, y: y }
        const pair: [StringPosition2d, string] = [
          JSON.stringify(position),
          char,
        ]
        return pair
      })
    })

  return {
    map: new Map(entries),
    height: height,
    width: width,
  }
}

function plus(x: Position2d, y: Position2d): Position2d {
  return { x: x.x + y.x, y: x.y + y.y }
}

function minus(x: Position2d, y: Position2d): Position2d {
  const negative = { x: -y.x, y: -y.y }
  return plus(x, negative)
}

function validPosition(
  position: Position2d,
  width: number,
  height: number,
): boolean {
  return (
    position.x >= 0 &&
    position.x < width &&
    position.y >= 0 &&
    position.y < height
  )
}

function antiNodes(
  positions: string[],
  repetitions: number,
  width: number,
  height: number,
): string[] {
  const nodes = positions
    .flatMap((position1) => {
      return positions.map((position2) => {
        return [position1, position2]
      })
    })
    .filter(([position1, position2]) => position1 !== position2)
    .flatMap(([position1, position2]) => {
      const pos1 = JSON.parse(position1)
      const pos2 = JSON.parse(position2)
      const difference = minus(pos2, pos1)

      const repeated = applyN<Position2d>(
        repetitions,
        (pos) => {
          return plus(pos, difference)
        },
        pos2,
      )
      return repeated
    })
    .filter((position) => {
      return validPosition(position, width, height)
    })
    .map((position) => {
      return JSON.stringify(position)
    })

  return nodes
}

function solve(input: PuzzleInput) {
  const byCharacter: [string, string[]][] = Object.entries(
    lodash.groupBy(Array.from(input.map.entries()), ([, char]) => char),
  )
    .map(([char, entries]) => {
      const pair: [string, string[]] = [char, entries.map((entry) => entry[0])]
      return pair
    })
    .filter(([char]) => char !== ".")
  const byCharacterMap = new Map(byCharacter)

  const byKey1 = Array.from(byCharacterMap.keys()).map((key) => {
    return antiNodes(byCharacterMap.get(key)!!, 1, input.width, input.height)
  })

  const all1 = lodash.union(...byKey1)

  const byKey2 = Array.from(byCharacterMap.keys()).map((key) => {
    // This is a HUGE overestimation, because even in the worst case scenario we only add at most input.width
    // anti-nodes, and not 2*input.width.
    // BUT: The implementation is very simple, correct, and the runtime is still significantly below 1 second,
    // which is good enough for me.
    return antiNodes(
      byCharacterMap.get(key)!!,
      input.width,
      input.width,
      input.height,
    )
  })

  const all2 = lodash.union(...byKey2)

  return {
    part1: BigInt(all1.length),
    part2: BigInt(all2.length),
  }
}

function Day08() {
  return DayWith("08", parse, solve)
}

export default Day08
