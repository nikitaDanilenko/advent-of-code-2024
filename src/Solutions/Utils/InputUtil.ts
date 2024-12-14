// Good grief, this is horrible!
// The issue is that Maps use reference equality on keys, i.e. manually constructed keys will not work.
// The 'stringify' function is a hack, and feels extremely wrong!
export type StringPosition = string

export type StringPositionMap = Map<StringPosition, string>

export function parseStringPositionMap(input: string): StringPositionMap {
  const map = input.split("\n").flatMap((line, y) => {
    return Array.from(line).map<[StringPosition, string]>((char, x) => {
      return [JSON.stringify({ x: x, y: y }), char]
    })
  })
  return new Map(map)
}
