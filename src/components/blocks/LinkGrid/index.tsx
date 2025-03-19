'use client'

import type { PaddingProps } from '@components/BlockWrapper/index'
import type { Page } from '@root/payload-types'

import { BackgroundGrid } from '@components/BackgroundGrid/index'
import { BlockSpacing } from '@components/BlockSpacing/index'
import { BlockWrapper } from '@components/BlockWrapper/index'
import { CMSLink } from '@components/CMSLink/index'
import { Gutter } from '@components/Gutter/index'
import { LineDraw } from '@components/LineDraw/index'
import { ArrowIcon } from '@root/icons/ArrowIcon/index'
import React, { useState } from 'react'

import classes from './index.module.scss'

export type LinkGridProps = {
  hideBackground?: boolean
  padding?: PaddingProps
} & Extract<Page['layout'][0], { blockType: 'linkGrid' }>

type Fields = Exclude<LinkGridProps['linkGridFields'], undefined>

type Props = Exclude<Fields['links'], null | undefined>[number]['link']

const LinkGridItem: React.FC<Props> = (props) => {
  return (
    <CMSLink {...props} className={classes.link}>
      <ArrowIcon className={classes.arrow} size="large" />
    </CMSLink>
  )
}

export const LinkGrid: React.FC<
  {
    className?: string
  } & LinkGridProps
> = (props) => {
  const { className, hideBackground, linkGridFields, padding } = props

  const links = linkGridFields?.links
  const hasLinks = Array.isArray(links) && links.length > 0

  return (
    <BlockWrapper
      className={[className, classes.linkGrid].filter(Boolean).join(' ')}
      hideBackground={hideBackground}
      padding={padding}
      settings={linkGridFields?.settings}
    >
      <BackgroundGrid zIndex={0} />
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
    </BlockWrapper>
  )
}
