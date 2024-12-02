import React from "react";

function DayWith<PuzzleInput>(
  number: string,
  parseInput: (text: string) => PuzzleInput,
  solvePart1: (puzzleInput: PuzzleInput) => bigint | string,
  solvePart2: (puzzleInput: PuzzleInput) => bigint | string,
) {
  const [input, setInput] = React.useState<string>("")
  const [part1, setPart1] = React.useState<bigint | string | undefined>(undefined)
  const [part2, setPart2] = React.useState<bigint | string | undefined>(undefined)
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
        <h1>{`Solution for Day ${number}`} </h1>
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

export default DayWith
