import { BlockSpacing } from '@components/BlockSpacing'
import React, { useState } from 'react'
import { Page } from '@root/payload-types'
import { Gutter } from '@components/Gutter'
import { CMSLink } from '@components/CMSLink'
import { ArrowIcon } from '@root/icons/ArrowIcon'
import { LineDraw } from '@components/LineDraw'
import classes from './index.module.scss'

export type LinkGridProps = Extract<Page['layout'][0], { blockType: 'linkGrid' }>

const Link: React.FC<LinkGridProps['linkGridFields']['links'][0]['link']> = props => {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <div
      className={classes.linkWrapper}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <LineDraw active={isHovered} />
      <CMSLink {...props} className={classes.link}>
        <ArrowIcon className={classes.icon} size="large" />
      </CMSLink>
    </div>
  )
}

export const LinkGrid: React.FC<LinkGridProps> = props => {
  const {
    linkGridFields: { links },
  } = props

  const hasLinks = Array.isArray(links) && links.length > 0

  return (
    <BlockSpacing className={classes.linkGrid}>
      <Gutter>
        {hasLinks && (
          <div className={classes.links}>
            {links.map(({ link }, index) => {
              return <Link {...link} key={index} />
            })}
          </div>
        )}
      </Gutter>
    </BlockSpacing>
  )
}
