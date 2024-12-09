import DayWith from "../Utils/DayUtil.tsx";

function Day09() {

  return DayWith(
    "09",
    (x: string) => x,
    x => {
      return {
        part1: BigInt(0),
        part2: BigInt(0),
      }
    }
  )
}

export default Day09
