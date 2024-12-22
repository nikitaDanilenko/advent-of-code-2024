import lodash from 'lodash'

export function takeUntilRemainderStartsWith(
  fragment: string,
  text: string
): [string, string] {
  const occurrence = text.indexOf(fragment)
  return occurrence >= 0
    ? [text.substring(0, occurrence), text.substring(occurrence)]
    : [text, '']
}

export function chunksEndingWith(
  text: string,
  ending: string
): string[] {
  const allParts = text.split(ending)
  const correctedParts = text.endsWith(ending) ? lodash.initial(allParts) : allParts
  return correctedParts.map(part => part + ending)
}

/**
 * Exact copy from Haskell, but specialized to the list monad.
 */
export function foldrM<A, R>(f: (a: A, r: R) => R[], acc: R, list: A[]): R[] {
  function combine(k: (r: R) => R[], x: A): (z: R) => R[] {
    function result(z: R): R[] {
      return f(x, z).flatMap(k)
    }

    return result
  }

  return list.reduce(
    (acc, a) => combine(acc, a),
    (z: R) => [z]
  )(acc)
}
