import type { SerializedHeadingNode, SerializedTextNode } from '@payloadcms/richtext-lexical'

import { ChainLinkIcon } from '@icons/ChainLinkIcon'
import slugify from '@root/utilities/slugify'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect } from 'react'

import { useRichText } from '../context'
import { formatAnchor } from '../formatAnchor'
import classes from './index.module.scss'

export const Heading: React.FC<{
  node: SerializedHeadingNode
  nodesToJSX: any
}> = ({ node: _node, nodesToJSX }) => {
  const node = JSON.parse(JSON.stringify(_node))
  const lastNode = node?.children?.length ? node.children[node.children.length - 1] : null
  let anchor: null | string = null

  if (lastNode && lastNode.type === 'text') {
    const textNode = lastNode as SerializedTextNode
    const anchorIndex = textNode.text?.lastIndexOf('#')
    if (anchorIndex !== -1) {
      anchor = textNode.text.slice(anchorIndex + 1).trim()
      textNode.text = textNode.text.slice(0, anchorIndex).trim()
    }
  }

  const childrenText = node.children
    .map((child) => {
      if (child.type === 'text') {
        return (child as SerializedTextNode).text
      }
    })
    .join(' ')

  if (!anchor) {
    // No anchor explicitly defined => generate one
    const { label, tag } = formatAnchor(childrenText)

    anchor = slugify(tag ?? label)
  }

  const pathname = usePathname()
  const { addHeading } = useRichText()

  useEffect(() => {
    addHeading(anchor, childrenText, 'secondary')
  }, [addHeading, anchor, childrenText])

  const HeadingElement: any = node.tag.toLowerCase()

  const children = nodesToJSX({
    nodes: node.children,
  })

  return (
    <Link className={classes.node} href={`${pathname}/#${anchor}`} id={anchor} replace>
      <HeadingElement>
        <ChainLinkIcon className={classes.linkedHeading} size="large" />
        {children}
      </HeadingElement>
    </Link>
  )
}
