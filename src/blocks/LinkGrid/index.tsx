'use client'

import React, { useState } from 'react'

import { BlockSpacing } from '@components/BlockSpacing'
import { CMSLink } from '@components/CMSLink'
import { Gutter } from '@components/Gutter'
import { LineDraw } from '@components/LineDraw'
import { ArrowIcon } from '@root/icons/ArrowIcon'
import { Page } from '@root/payload-types'

import classes from './index.module.scss'

export type LinkGridProps = Extract<Page['layout'][0], { blockType: 'linkGrid' }>

type Fields = Exclude<LinkGridProps['linkGridFields'], undefined>

type Props = Exclude<Fields['links'], undefined>[number]['link']

const LinkGridItem: React.FC<Props> = props => {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <div
      className={classes.linkWrapper}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <LineDraw active={isHovered} align="bottom" />
      <CMSLink {...props} className={classes.link}>
        <ArrowIcon className={classes.icon} size="large" />
      </CMSLink>
    </div>
  )
}

export const LinkGrid: React.FC<
  LinkGridProps & {
    className?: string
    topMargin?: boolean
    bottomMargin?: boolean
  }
> = props => {
  const { className, topMargin, bottomMargin, linkGridFields } = props

  const links = linkGridFields?.links
  const hasLinks = Array.isArray(links) && links.length > 0

  return (
    <BlockSpacing
      className={[className, classes.linkGrid].filter(Boolean).join(' ')}
      top={topMargin}
      bottom={bottomMargin}
    >
      <Gutter>
        {hasLinks && (
          <div className={classes.links}>
            {links.map((link, index) => {
              return (
                <LinkGridItem
                  key={index}
                  {...(link?.link || {
                    label: 'Untitled',
                  })}
                />
              )
            })}
          </div>
        )}
      </Gutter>
    </BlockSpacing>
  )
}
