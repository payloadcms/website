import { JumplistNode } from '@components/Jumplist'
import slugify from '@root/utilities/slugify'
import { useEffect } from 'react'

import { useRichText } from './context'
import { formatAnchor } from './formatAnchor'

export const Heading: React.FC<any> = ({ node, nodesToJSX }) => {
  const children = nodesToJSX({
    nodes: node.children,
  })

  const childrenText = node.children?.[0]?.text as string

  const { label, tag } = formatAnchor(childrenText)
  const { addHeading } = useRichText()

  const anchor = slugify(tag ?? label)

  useEffect(() => {
    addHeading(anchor, childrenText, 'secondary')
  }, [addHeading, anchor, childrenText])

  return (
    <JumplistNode id={anchor} type={node.tag.toLowerCase()}>
      {children.length > 1 ? children : label}
    </JumplistNode>
  )
}
