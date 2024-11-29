const world: string = 'world'

export function hello(who: string = world): string {
  return `Hello you, ${who}!`
}
