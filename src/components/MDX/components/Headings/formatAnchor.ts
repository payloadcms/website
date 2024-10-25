function extractChildren(node: any): string {
  if (node.props && node.props.children) {
    if (typeof node.props.children === 'string') {
      return node.props.children
    } else if (typeof node.props.children === 'object') {
      return extractChildren(node.props.children)
    }
  }
  return ''
}

const flattenChildren: (value: string | { props: { children: any } }) => string = value => {
  if (typeof value === 'string') {
    return value
  }

  // Extract a deeply nested string from a Lexical node
  const stringValue = extractChildren(value)

  if (typeof stringValue === 'string') {
    return stringValue
  }

  return value.props.children
}

export const formatAnchor: (children: string | string[]) => string = children => {
  if (Array.isArray(children)) {
    return children.map(flattenChildren).join('')
  }
  return flattenChildren(children)
}
