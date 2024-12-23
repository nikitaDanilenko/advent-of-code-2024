import { Solution } from '../Utils/Types.ts'
import DayWith from '../Utils/DayUtil.tsx'
import lodash from 'lodash'

type PuzzleInput = Edge[]

type Edge = {
  from: string
  to: string
}

function parseEdge(text: string): Edge {
  const [from, to] = text.split('-')
  return { from: from, to: to }
}

function parse(input: string): PuzzleInput {
  return input
    .split('\n')
    .filter(l => l.length > 0)
    .map(parseEdge)
}

type Node = string

type Graph = Map<Node, Node[]>

function makeGraph(edges: Edge[]): Graph {
  const graph = new Map<Node, Node[]>()
  edges.forEach(edge => {
    const { from, to } = edge
    graph.set(from, (graph.get(from) || []).concat(to))
    graph.set(to, (graph.get(to) || []).concat(from))
  })

  return graph
}

function reachabilityLayers(start: Node[], graph: Graph): Node[][] {
  let visited = new Set<Node>(start)

  function iterate(currentLayer: Node[], layers: Node[][]): Node[][] {
    if (currentLayer.length === 0) {
      return layers
    } else {
      const nextLayer = currentLayer
        .flatMap(node => graph.get(node) || [])
        .filter(neighbour => !visited.has(neighbour))
      currentLayer.forEach(node => visited.add(node))
      return iterate(nextLayer, [...layers, currentLayer])
    }
  }

  return iterate(start, [])
}

function connectedComponents(graph: Graph): Node[][] {
  function step(node: Node): Node[] {
    const layers = reachabilityLayers([node], graph)
    const component = layers.flat()
    return component
  }

  let unvisited = new Set(graph.keys())
  let components: Node[][] = []
  while (unvisited.size > 0) {
    const node = lodash.first([...unvisited])!
    const component = step(node)
    components = [...components, component]
    component.forEach(node => unvisited.delete(node))
  }

  return components
}

function threeNodeComponentsWithT(graph: Graph): Node[][] {
  const components = connectedComponents(graph)
  return components.filter(component => {
    const existsT = lodash.some(component, node => node.startsWith('t'))
    return component.length === 3 && existsT
  })
}

function triangleNodes(graph: Graph): Node[][] {
  let unvisited = new Set(graph.keys())

  let triplets: Node[][] = []
  while (unvisited.size > 0) {
    const node = lodash.first([...unvisited])!
    unvisited.delete(node)
    const neighbours = graph.get(node) || []

    neighbours.forEach(neighbour1 => {
      neighbours.forEach(neighbour2 => {
        if (neighbour1 !== neighbour2) {
          const haveEdge = graph.get(neighbour1)!.includes(neighbour2)
          if (haveEdge) {
            triplets.push([node, neighbour1, neighbour2])
          }
        }
      })
    })
  }

  return lodash.uniqBy(triplets, triplet => triplet.sort().join(''))
}

function solve(input: PuzzleInput): Solution<bigint> {
  const graph = makeGraph(input)
  const components = triangleNodes(graph)

  const part1 = components.filter(triplet => lodash.some(triplet, node => node.startsWith('t'))).length

  return {
    part1: BigInt(part1),
    part2: BigInt(0)
  }
}

function Day23() {
  return DayWith('23', parse, solve)
}

export default Day23
