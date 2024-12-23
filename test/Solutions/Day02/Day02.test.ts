import { describe, expect, test } from 'vitest'
import { parse, solve } from '../../../src/Solutions/Day02/Day02'

const exampleInput = `
7 6 4 2 1
1 2 7 8 9
9 7 6 2 1
1 3 2 4 5
8 6 4 4 1
1 3 6 7 9
`

describe('Day 02', () => {
  test('AoC example should work', () => {
    const solution = solve(parse(exampleInput))
    expect(solution).toEqual({ part1: 2n, part2: 4n })
  })
})
