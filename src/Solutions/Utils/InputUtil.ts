// Good grief, this is horrible!
// The issue is that Maps use reference equality on keys, i.e. manually constructed keys will not work.
// The 'stringify' function is a hack, and feels extremely wrong!
export type StringPosition = string

// Todo: This should have dimensions as well.
export type StringPositionMap = StringPositionTypedMap<string>

export type StringPositionTypedMap<T> = Map<StringPosition, T>

export function parseStringPositionMap(input: string): StringPositionMap {
  return parseStringPositionTypedMap(input, (char) => char)
}

// We could also add parsing as a function, so we do not need that many conversions.
export function parseStringPositionTypedMap<T>(
  input: string,
  parse: (_: string) => (T | undefined)
): StringPositionTypedMap<T> {
  const map = input.split('\n').flatMap((line, y) => {
    return Array
      .from(line)
      .map((char, x) => {
        const candidate = parse(char)
        if (candidate === undefined) {
          return undefined
        } else {
          return [JSON.stringify({x: x, y: y}), candidate] as [StringPosition, T]
        }
      })
      .filter((entry) => entry !== undefined)
  })
  return new Map(map)
}
