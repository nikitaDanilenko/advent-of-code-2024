import {Pair} from "./Types";

export function zip<T1, T2>(arr1: Array<T1>, arr2: Array<T2>): Array<Pair<T1, T2>> {
  const length = Math.min(arr1.length, arr2.length);
  const zipped: Array<Pair<T1, T2>> = [];

  for (let index = 0; index < length; index++) {
    zipped.push({first: arr1[index], second: arr2[index]});
  }

  return zipped;
}
