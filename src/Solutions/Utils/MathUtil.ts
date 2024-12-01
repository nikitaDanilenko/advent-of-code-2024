import lodash from "lodash";

export function absBigInt(x: bigint): bigint {
  return x >= 0 ? x : -x
}

export function sum(list: lodash.List<bigint>): bigint {
   return lodash.reduce(list, (acc, value) => acc + value, BigInt(0))
}
