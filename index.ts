/**
 * Our outputs must look like this:
 */
type Agg = {
  key: string
  entries: Array<{
    value: any
    count: number
  }>
}

/**
 * Our inputs will look like this:
 */
type TNode = {
  properties: Array<{ key: string; value: any }>
  children?: TNode[]
}

/**
 * Given a collection of `roots`, determines some aggregated property information
 * and returns a collection of those of those aggregates.
 */
export const calculateAggs = (roots: TNode[]): Agg[] => {
  // The slower implementation:
  // return impl1(roots, [])

  // The faster implementation:
  return Object.entries(impl2(roots)).map(([key, valueCounts]) => ({
    key,
    entries: Object.entries(valueCounts).map(([value, count]) => ({
      value,
      count,
    })),
  }))
}

/**
 * The first implementation, uses recursion and `find`.
 */
const impl1 = (nodes: TNode[], aggsSoFar: Agg[]) =>
  nodes.reduce((aggs, node) => {
    node.properties.forEach((property) => {
      const existingAgg = aggs.find((agg) => agg.key === property.key)
      if (existingAgg) {
        const existingEntry = existingAgg.entries.find(
          (entry) => entry.value === property.value,
        )

        if (existingEntry) {
          existingEntry.count++
        } else {
          existingAgg.entries.push({ count: 1, value: property.value })
        }
      } else {
        aggs.push({
          key: property.key,
          entries: [{ count: 1, value: property.value }],
        })
      }
    })

    if (node.children) {
      impl1(node.children, aggs)
    }

    return aggs
  }, aggsSoFar)

/**
 * Iterate through a collection of `nodes`, performing a `func` on each.
 */
const treeIterate = (nodes: TNode[], func: (node: TNode) => unknown) => {
  let todo = nodes.slice()
  let current: TNode | undefined
  while (todo && todo.length > 0) {
    current = todo.pop()
    if (current) {
      func(current)

      if (current.children && current.children.length > 0) {
        todo = todo.concat(current.children)
      }
    }
  }
}

/**
 * The second implementation, non-recursive and uses maps.
 */
const impl2 = (nodes: TNode[]) => {
  const aggMap: {
    [key: string]: {
      [value: string]: number
    }
  } = {}

  treeIterate(nodes, (node) => {
    node.properties.forEach(({ key, value }) => {
      const existingAgg = aggMap[key]
      if (existingAgg) {
        existingAgg[value] = (existingAgg[value] ?? 0) + 1
      } else {
        aggMap[key] = { [value]: 1 }
      }
    })
  })

  return aggMap
}
