import { Position2d, Solution } from '../Utils/Types.ts'
import DayWith from '../Utils/DayUtil.tsx'
import lodash from 'lodash'

type Robot = {
  start: Position2d
  velocity: Position2d
}

const robotRegExp: RegExp = /p=(\d+),(\d+) v=(-?\d+),(-?\d+)/g

type PuzzleInput = {
  robots: Robot[]
}

function parse(input: string): PuzzleInput {
  const robots = Array.from(input.matchAll(robotRegExp)).map(match => {
    return {
      start: { x: parseInt(match[1]), y: parseInt(match[2]) },
      velocity: { x: parseInt(match[3]), y: parseInt(match[4]) }
    }
  })
  return { robots: robots }
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

function byQuadrants(
  positions: Position2d[]
): [Position2d[], Position2d[], Position2d[], Position2d[]] {
  const halfWidth = (width - 1) / 2
  const halfHeight = (height - 1) / 2
  return [
    positions.filter(
      position => position.x < halfWidth && position.y < halfHeight
    ),
    positions.filter(
      position => position.x > halfWidth && position.y < halfHeight
    ),
    positions.filter(
      position => position.x < halfWidth && position.y > halfHeight
    ),
    positions.filter(
      position => position.x > halfWidth && position.y > halfHeight
    )
  ]
}

function heuristic(robots: Robot[]): number {
  function moveRobot(robot: Robot, times: number): Robot {
    return {
      ...robot,
      start: move(robot, times)
    }
  }

  function groupIncreasing(numbers: number[]): number[][] {
    const grouped = numbers.reduce<[number, number[], number[][]]>(
      ([start, group, groups], number) => {
        if (number == start + 1) {
          return [number, [...group, number], groups]
        } else {
          return [number, [], [...groups, group]]
        }
      },
      [numbers[0], [], []]
    )
    return grouped[2]
  }

  const moveRobots = (robots: Robot[], times: number) =>
    robots.map(robot => moveRobot(robot, times))

  const maxIterations = width * height
  const bestGuess = 30

  let currentIterations = 0

  while (currentIterations < maxIterations) {
    // Arithmetic should be cheap, i.e. little difference between one or many steps.
    const moved = moveRobots(robots, currentIterations)

    /* This is very optimistic:
       The assumption is that 'bestGuess' robots are aligned in a column, i.e. there are 'bestGuess' robots
       with the same x-coordinate and y-coordinates that are increasing by 1.

       The value for 'bestGuess' and the limit on the iterations is taken from hints on Reddit.

       Once one has seen the solution, one can probably improve the function, because the Christmas tree
       has a closed frame, and one can look for some sufficiently large frame relatively simply.
       However, without the knowledge that there is a frame, this seems to be far-fetched.
    */
    const enoughAligned =
      Object.entries(lodash.groupBy(moved, robot => robot.start.x)).filter(
        ([, rs]) => {
          if (rs.length > bestGuess) {
            const sorted = rs
              .sort((a, b) => a.start.y - b.start.y)
              .map(robot => robot.start.y)
            const grouped = groupIncreasing(sorted)
            return lodash.some(grouped, group => group.length > bestGuess)
          } else {
            return false
          }
        }
      ).length > 0
    if (enoughAligned) {
      break
    }
    currentIterations++
  }

  return currentIterations
}

function solve(input: PuzzleInput): Solution<bigint> {
  const moved = input.robots.map(robot => move(robot, 100))
  const quadrants = byQuadrants(moved)
  const solution1 = quadrants.reduce(
    (acc, robots) => acc * BigInt(robots.length),
    BigInt(1)
  )
  const solution2 = heuristic(input.robots)
  return {
    part1: solution1,
    part2: BigInt(solution2)
  }
}

function Day14() {
  return DayWith('14', parse, solve)
}

export default Day14
