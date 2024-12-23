import { describe, test } from 'vitest'
import fc from 'fast-check'
import { applyNOnlyLast } from '../../../src/Solutions/Utils/MathUtil'

describe('applyNOnlyLast', () => {
  test('returns the starting value with values <= 0', () => {
    fc.assert(
      fc.property(
        fc.integer({ max: 0 }),
        fc.integer(),
        (iterations, start) => applyNOnlyLast(iterations, (n: number) => n + 1, start) === start
      )
    )
  })

  test('is a homomorphism in from (Int, +) to (Int -> Int, compose)', () => {
    const f = (n: number) => n + 1
    // Small-ish numbers here, because the function is relatively slow.
    const halfNat = fc.nat(10000)

    fc.assert(
      fc.property(
        halfNat,
        halfNat,
        fc.integer(),
        (iterations1, iterations2, start) => {
          const allIterations = iterations1 + iterations2
          const afterIterations1 = applyNOnlyLast(iterations1, f, start)
          const afterIterations2 = applyNOnlyLast(iterations2, f, afterIterations1)
          const afterAllIterations = applyNOnlyLast(allIterations, f, start)

          return afterIterations2 === afterAllIterations
        }
      )
    )
  })


})

