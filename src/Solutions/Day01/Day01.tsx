import React from "react"
import {Pair} from "../Utils/Types";
import {absBigInt, sum} from "../Utils/MathUtil";
import lodash from "lodash";

function Day01() {
  const [input, setInput] = React.useState<string>("")
  const [part1, setPart1] = React.useState<bigint | undefined>(undefined)
  const [part2, setPart2] = React.useState<bigint | undefined>(undefined)
  const [error, setError] = React.useState<string>("")

  function handleTextAreaChange(event: React.ChangeEvent<HTMLTextAreaElement>): void {
    setInput(event.target.value)
    resetResponses()
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>): void {
    event.preventDefault()
    try {
      submitForm(input)
    } catch (err: any) {
      setError(err.message)
    }
  }

  type PuzzleInput = {
    firstList: bigint[],
    secondList: bigint[]
  }

  function parseInput(puzzleInput: string): PuzzleInput {
    const pairs = puzzleInput
      .split("\n")
      .filter((line) => line !== "")
      .map((line) => {
        const words = line.split("   ").map((word) => BigInt(word))

        return words.length >= 2 ? {first: words[0], second: words[1]} : null;
      })
      .filter((pair) => pair !== null)

    function sort(f: (pair: Pair<bigint, bigint>) => bigint): bigint[] {
      return pairs.map(f).sort((a, b) => Number(a - b))
    }

    const firsts = sort((pair) => pair.first)
    const seconds = sort((pair) => pair.second)

    return {firstList: firsts, secondList: seconds}
  }

  function solvePart1(puzzleInput: PuzzleInput): bigint {
    const result =
      sum(
        lodash
          .zipWith(puzzleInput.firstList, puzzleInput.secondList, (x, y) => ({first: x, second: y}))
          .map((pair) => absBigInt(pair.first - pair.second))
      )

    return result
  }

  function solvePart2(puzzleInput: PuzzleInput): bigint {

    const o: Map<string, number> = new Map(
      Object.entries(lodash.groupBy(puzzleInput.secondList, (value) => value))
        .map(([key, value]) => [key, value.length])
    )

    const result =
      sum(puzzleInput
        .firstList
        .map((value) => {
          const inSecond = o.get(value.toString()) || 0
          return value * BigInt(inSecond)
        }))

    return result
  }

  function submitForm(input: string): void {
    const parsed = parseInput(input)
    setPart1(solvePart1(parsed))
    setPart2(solvePart2(parsed))
  }

  function resetResponses(): void {
    setError('')
    setPart1(undefined)
    setPart2(undefined)
  }

  function resetInput(): void {
    setInput('')
    resetResponses()
  }

  const errorBlock = <p>{error}</p>
  // Todo: The conditional setup is not pretty.
  const responseBlock = <section>
    {part1 !== undefined && <section>
      <h2>Part 1</h2>
      <p>{part1.toString()}</p>
    </section>}
    {part2 !== undefined && <section>
      <h2>Part 2</h2>
      <p>{part2.toString()}</p>
    </section>
    }
    {(part1 ?? part2) !== undefined && <button onClick={resetInput}>Reset input</button>}
  </section>

  const page =
    <main>
      <header>
        <h1>Solution for Day 01</h1>
      </header>
      <section>
        <h2>Input</h2>
        <form onSubmit={handleSubmit}>
          <textarea
            onInput={handleTextAreaChange}
            value={input}
          />
          <button>Calculate</button>
        </form>
      </section>
      {error !== '' ? errorBlock : responseBlock}
    </main>

  return page
}

export default Day01
