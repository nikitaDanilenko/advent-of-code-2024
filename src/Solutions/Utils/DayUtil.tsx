import React from "react"
import {rootPath} from "../../Paths.ts"
import {Link} from "react-router-dom"
import {Solution} from "./Types.ts"

function DayWith<PuzzleInput>(
  number: string,
  parseInput: (text: string) => PuzzleInput,
  solve: (puzzleInput: PuzzleInput) => Solution<bigint | string>,
) {
  const [input, setInput] = React.useState<string>("")
  const [part1, setPart1] = React.useState<bigint | string | undefined>(undefined)
  const [part2, setPart2] = React.useState<bigint | string | undefined>(undefined)
  const [duration, setDuration] = React.useState<number>(0)
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

  function submitForm(input: string): void {
    const parsed = parseInput(input)
    const start = Date.now()
    const {part1, part2} = solve(parsed)
    const end = Date.now()
    setDuration(end - start)
    setPart1(part1)
    setPart2(part2)
  }

  function resetResponses(): void {
    setError('')
    setDuration(0)
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
        <h1>{`Solution for Day ${number}`} </h1>
        <Link to={rootPath}>Back to overview</Link>
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
      {duration > 0 && <p>{`Duration: ${duration}ms`}</p>}
    </main>

  return page
}

export default DayWith
