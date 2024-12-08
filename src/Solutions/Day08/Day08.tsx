import DayWith from "../Utils/DayUtil.tsx";
import {Position2d} from "../Utils/Types.ts";
import lodash from "lodash";

type StringPosition2d = string

type PuzzleInput = {
  map: Map<StringPosition2d, string>,
  height: number,
  width: number
}

function parse(input: string): PuzzleInput {
  const lines = input.split("\n").filter((line) => line !== "")
  const height = lines.length
  const width = lines[0].length

  const entries = input
    .split("\n")
    .filter(line => line !== '')
    .flatMap((line, y) => {
      return line.split("").map((char, x) => {
        const position = {x: x, y: y}
        const pair: [StringPosition2d, string] = [JSON.stringify(position), char]
        return pair
      })
    })

  return {
    map: new Map(entries),
    height: height,
    width: width
  }
}

function plus(x: Position2d, y: Position2d): Position2d {
  return {x: x.x + y.x, y: x.y + y.y}
}

function minus(x: Position2d, y: Position2d): Position2d {
  const negative = {x: -y.x, y: -y.y}
  return plus(x, negative)
}

function validPosition(position: Position2d, width: number, height: number): boolean {
  return position.x >= 0 && position.x < width && position.y >= 0 && position.y < height
}

function antiNodes(positions: string[], width: number, height: number): string[] {
  const nodes = positions
    .flatMap((position1) => {
      return positions.map((position2) => {
        return [position1, position2]
      })
    })
    .filter(([position1, position2]) => position1 !== position2)
    .map(([position1, position2]) => {
      const pos1 = JSON.parse(position1)
      const pos2 = JSON.parse(position2)
      const difference = minus(pos2, pos1)
      return plus(pos2, difference)
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
  const byCharacter: [string, string[]][] =
    Object.entries(
      lodash.groupBy(
        Array.from(input.map.entries()),
        ([, char]) => char
      )
    )
      .map(([char, entries]) => {
        const pair: [string, string[]] = [char, entries.map((entry) => entry[0])]
        return pair
      })
      .filter(([char]) => char !== ".")
  const byCharacterMap = new Map(byCharacter)

  const byKey = Array
    .from(byCharacterMap.keys())
    .map((key) => {
      return antiNodes(byCharacterMap.get(key)!!, input.width, input.height)
    })

  const all = lodash.union(...byKey)

  return {
    part1: BigInt(all.length),
    part2: BigInt(0)
  }
}

function Day08() {

  return DayWith(
    "08",
    parse,
    solve
  )
}

export default Day08;
