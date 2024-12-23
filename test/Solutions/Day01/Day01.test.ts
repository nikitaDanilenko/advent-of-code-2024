import { describe, expect, test } from 'vitest'
import { parse, solve } from '../../../src/Solutions/Day01/Day01'

const exampleInput = `
3   4
4   3
2   5
1   3
3   9
3   3
`

describe('Day 01', () => {
  test('AoC example should work', () => {
    const solution = solve(parse(exampleInput))
    expect(solution).toEqual({ part1: 11n, part2: 31n })
  })
})
