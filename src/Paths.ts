import React from "react"
import Day01 from "./Solutions/Day01/Day01.tsx"
import Day02 from "./Solutions/Day02/Day02.tsx"
import Day03 from "./Solutions/Day03/Day03.tsx"
import Day04 from "./Solutions/Day04/Day04.tsx"
import Day05 from "./Solutions/Day05/Day05.tsx"
import Day06 from "./Solutions/Day06/Day06.tsx"
import Day07 from "./Solutions/Day07/Day07.tsx"
import Day08 from "./Solutions/Day08/Day08.tsx"
import Day09 from "./Solutions/Day09/Day09.tsx"
import Day10 from "./Solutions/Day10/Day10.tsx"
import Day11 from "./Solutions/Day11/Day11.tsx"
import Day12 from "./Solutions/Day12/Day12.tsx"
import Day13 from "./Solutions/Day13/Day13.tsx"
import Day14 from "./Solutions/Day14/Day14.tsx"
import Day15 from "./Solutions/Day15/Day15.tsx"
import Day16 from "./Solutions/Day16/Day16.tsx"
import Day17 from "./Solutions/Day17/Day17.tsx"
import Day18 from "./Solutions/Day18/Day18.tsx"
import Day19 from "./Solutions/Day19/Day19.tsx"
import Day20 from "./Solutions/Day20/Day20.tsx"
import Day21 from "./Solutions/Day21/Day21.tsx"
import Day22 from "./Solutions/Day22/Day22.tsx"
import Day23 from "./Solutions/Day23/Day23.tsx"
import Day24 from "./Solutions/Day24/Day24.tsx"
import Day25 from "./Solutions/Day25/Day25.tsx"

export const rootPath: string = "/"

export const days: (() => React.JSX.Element)[] = [
  Day01,
  Day02,
  Day03,
  Day04,
  Day05,
  Day06,
  Day07,
  Day08,
  Day09,
  Day10,
  Day11,
  Day12,
  Day13,
  // Day14,
  // Day15,
  // Day16,
  // Day17,
  // Day18,
  // Day19,
  // Day20,
  // Day21,
  // Day22,
  // Day23,
  // Day24,
  // Day25
]

function padToTwoDigits(day: number): string {
  return day.toString().padStart(2, "0")
}

export function dayPath(day: number): string {
  return `day${padToTwoDigits(day)}`
}

export function dayText(day: number): string {
  return `Day ${padToTwoDigits(day)}`
}

