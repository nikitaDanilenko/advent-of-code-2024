import React from "react"
import Day01 from "./Solutions/Day01/Day01.tsx"
import Day02 from "./Solutions/Day02/Day02.tsx"
import Day03 from "./Solutions/Day03/Day03.tsx"
import Day04 from "./Solutions/Day04/Day04.tsx"
import Day05 from "./Solutions/Day05/Day05.tsx";
import Day06 from "./Solutions/Day06/Day06.tsx";
import Day07 from "./Solutions/Day07/Day07.tsx";

export const rootPath: string = "/"

export const days: (() => React.JSX.Element)[] = [
  Day01,
  Day02,
  Day03,
  Day04,
  Day05,
  Day06,
  Day07,
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

