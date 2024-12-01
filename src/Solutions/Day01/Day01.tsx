import React from "react"
import {Pair} from "../Utils/Types";
import {zip} from "../Utils/ArrayUtil";
import {absBigInt} from "../Utils/MathUtil";

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
    pairs: Pair<bigint, bigint>[]
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
    return {pairs: pairs}
  }

  function solvePart1(puzzleInput: PuzzleInput): bigint {
    function sort(f: (pair: Pair<bigint, bigint>) => bigint): bigint[] {
      return puzzleInput.pairs.map(f).sort((a, b) => Number(a - b))
    }

    const firsts = sort((pair) => pair.first)
    const seconds = sort((pair) => pair.second)

    const result = zip(firsts, seconds)
      .map((pair) => absBigInt(pair.first - pair.second))
      .reduce((acc, diff) => acc + diff, BigInt(0))

    return result
  }

  function solvePart2(puzzleInput: PuzzleInput): bigint {
    return BigInt(0)
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
