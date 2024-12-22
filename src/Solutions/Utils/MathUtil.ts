import lodash from 'lodash'
import { Position2d } from './Types.ts'
import { StringPosition, StringPositionTypedMap } from './InputUtil.ts'

export function absBigInt(x: bigint): bigint {
  return x >= 0 ? x : -x
}

export function sum(list: lodash.List<bigint>): bigint {
  return lodash.reduce(list, (acc, value) => acc + value, BigInt(0))
}

export function min(list: lodash.List<bigint>): bigint | undefined {
  return lodash.reduce(list, (acc, value) => acc < value ? acc : value)
}

/**
 * Careful: If you want the nth application, use n + 1,
 * because the last value added to the list is the second to last application.
 */
export function applyN<A>(n: number, f: (a: A) => A, a: A): A[] {
  function applyWith(applied: A, remaining: number, values: A[]): A[] {
    return remaining === 0
      ? values
      : applyWith(f(applied), remaining - 1, [...values, applied])
  }

  return applyWith(a, n, [])
}

/** Careful: If you want the nth application, really use n.
 */
export function applyNOnlyLast<A>(n: number, f: (a: A) => A, a: A): A {
  function applyWith(applied: A, remaining: number): A {
    return remaining === 0
      ? applied
      : applyWith(f(applied), remaining - 1)
  }

  return applyWith(a, n)
}

export function applyWhile<A>(predicate: (a: A) => boolean, f: (a: A) => A, a: A): A[] {
  function applyWith(applied: A, values: A[]): A[] {
    return predicate(applied)
      ? applyWith(f(applied), [...values, applied])
      : values
  }

  return applyWith(a, [])
}

export function reachabilityLayers<E>(
  neighbours: (p: Position2d, m: StringPositionTypedMap<E>) => Position2d[],
  start: Position2d[],
  target: Position2d[],
  map: StringPositionTypedMap<E>
): Position2d[][] | undefined {
  let visited = new Set<StringPosition>()
  const targetSet = target.map(p => JSON.stringify(p))

  function iterate(currentLayer: Position2d[], layers: Position2d[][]): Position2d[][] | undefined {
    const currentLayerStrings = currentLayer.map(p => JSON.stringify(p))
    const intersectionWithTarget = lodash.intersection(currentLayerStrings, targetSet)
    if (intersectionWithTarget.length > 0) {
      return layers
    } else if (currentLayer.length === 0) {
      return undefined
    } else {
      currentLayerStrings.forEach(position => visited.add(position))
      const nextLayer =
        lodash.uniqBy(
          currentLayer
            .flatMap(position => neighbours(position, map))
            .filter(neighbour => !visited.has(JSON.stringify(neighbour))),
          p => JSON.stringify(p)
        )

      return iterate(nextLayer, [...layers, currentLayer])
    }
  }

  return iterate(start, [])
}
