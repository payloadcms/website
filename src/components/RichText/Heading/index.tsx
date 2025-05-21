import { ChainLinkIcon } from '@icons/ChainLinkIcon'
import slugify from '@root/utilities/slugify'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect } from 'react'

import { useRichText } from '../context'
import { formatAnchor } from '../formatAnchor'
import classes from './index.module.scss'

export const Heading: React.FC<any> = ({ node, nodesToJSX }) => {
  const children = nodesToJSX({
    nodes: node.children,
  })
  const pathname = usePathname()

  const childrenText = node.children?.[0]?.text as string

  const { label, tag } = formatAnchor(childrenText)
  const { addHeading } = useRichText()

  const anchor = slugify(tag ?? label)

  useEffect(() => {
    addHeading(anchor, childrenText, 'secondary')
  }, [addHeading, anchor, childrenText])

  const HeadingElement = node.tag.toLowerCase()

  return (
    <Link className={classes.node} href={`${pathname}/#${anchor}`} id={anchor} replace>
      <HeadingElement>
        <ChainLinkIcon className={classes.linkedHeading} size="large" />
        {children}
      </HeadingElement>
    </Link>
  )
}
