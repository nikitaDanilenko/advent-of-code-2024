import {Position2d, Solution} from "../Utils/Types.ts"
import DayWith from "../Utils/DayUtil.tsx"

type Robot = {
  start: Position2d
  velocity: Position2d
}

const robotRegExp: RegExp = /p=(\d+),(\d+) v=(-?\d+),(-?\d+)/g

type PuzzleInput = {
  robots: Robot[]
}

function parse(input: string): PuzzleInput {
  const robots =
    Array
      .from(input.matchAll(robotRegExp))
      .map((match) => {
        return {
          start: {x: parseInt(match[1]), y: parseInt(match[2])},
          velocity: {x: parseInt(match[3]), y: parseInt(match[4])}
        }
      })
  return {robots: robots}
}

function move(robot: Robot, time: number): Position2d {
  return {
    x: mod(robot.start.x + robot.velocity.x * time, width),
    y: mod(robot.start.y + robot.velocity.y * time, height)
  }
}

const width = 101
const height = 103

function mod(x: number, modulus: number): number {
  return ((x % modulus) + modulus) % modulus
}

function byQuadrants(positions: Position2d[]): [Position2d[], Position2d[], Position2d[], Position2d[]] {
  const halfWidth = (width - 1) / 2
  const halfHeight = (height - 1) / 2
  return [
    positions.filter((position) => position.x < halfWidth && position.y < halfHeight),
    positions.filter((position) => position.x > halfWidth && position.y < halfHeight),
    positions.filter((position) => position.x < halfWidth && position.y > halfHeight),
    positions.filter((position) => position.x > halfWidth && position.y > halfHeight)
  ]
}

function solve(input: PuzzleInput): Solution<bigint> {
  const moved = input.robots.map((robot) => move(robot, 100))
  const quadrants = byQuadrants(moved)
  const solution1 = quadrants.reduce((acc, robots) => acc * BigInt(robots.length), BigInt(1))
  return {
    part1: solution1,
    part2: BigInt(0)
  }
}

function Day14() {
  return DayWith(
    "14",
    parse,
    solve,
  )
}

export default Day14
