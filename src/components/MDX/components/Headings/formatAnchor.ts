const flattenChildren: (value: string | { props: { children: any } }) => string = value => {
  if (typeof value === 'string') {
    return value
  }
  return value.props.children
}

export const formatAnchor: (children: string | string[]) => string = children => {
  if (Array.isArray(children)) {
    return children.map(flattenChildren).join('')
  }
  return flattenChildren(children)
}
