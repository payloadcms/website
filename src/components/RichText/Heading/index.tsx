import type { SerializedHeadingNode, SerializedTextNode } from '@payloadcms/richtext-lexical'

import { ChainLinkIcon } from '@icons/ChainLinkIcon'
import slugify from '@root/utilities/slugify'
import Link from 'next/link'
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
    const customAnchorMatch = textNode.text?.match(/#([\w-]+)\s*$/)

    if (customAnchorMatch) {
      anchor = customAnchorMatch[1]
      textNode.text = textNode.text.slice(0, customAnchorMatch.index).trim()
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

  const { addHeading } = useRichText()

  useEffect(() => {
    addHeading(anchor, childrenText, 'secondary')
  }, [addHeading, anchor, childrenText])

  const HeadingElement: any = node.tag.toLowerCase()

  const children = nodesToJSX({
    nodes: node.children,
  })

  return (
    <HeadingElement className={classes.node} id={anchor}>
      <Link aria-label={`Link to ${childrenText}`} href={`#${anchor}`} replace>
        <ChainLinkIcon className={classes.linkedHeading} size="large" />
      </Link>
      {children}
    </HeadingElement>
  )
}
