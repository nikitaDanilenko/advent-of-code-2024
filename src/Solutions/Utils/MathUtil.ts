import lodash from "lodash"

export function absBigInt(x: bigint): bigint {
  return x >= 0 ? x : -x
}

export function sum(list: lodash.List<bigint>): bigint {
   return lodash.reduce(list, (acc, value) => acc + value, BigInt(0))
}

export function applyN<A>(n: number, f: (a: A) => A, a: A): A[] {
  function applyWith(applied: A, remaining: number, values: A[]): A[] {
    return remaining === 0 ? values : applyWith(f(applied), remaining - 1, [...values, applied] )
  }

  return applyWith(a, n, [])
}
