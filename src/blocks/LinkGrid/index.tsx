'use client'

import React, { useState } from 'react'

import { BackgroundGrid } from '@components/BackgroundGrid'
import { BlockSpacing } from '@components/BlockSpacing'
import { BlockWrapper, PaddingProps } from '@components/BlockWrapper'
import { CMSLink } from '@components/CMSLink'
import { Gutter } from '@components/Gutter'
import { LineDraw } from '@components/LineDraw'
import { ArrowIcon } from '@root/icons/ArrowIcon'
import { Page } from '@root/payload-types'

import classes from './index.module.scss'

export type LinkGridProps = Extract<Page['layout'][0], { blockType: 'linkGrid' }> & {
  padding: PaddingProps
}

type Fields = Exclude<LinkGridProps['linkGridFields'], undefined>

type Props = Exclude<Fields['links'], undefined | null>[number]['link']

const LinkGridItem: React.FC<Props> = props => {
  return (
    <CMSLink
      {...props}
      className={classes.link}
      appearance={'default'}
      buttonProps={{
        appearance: 'default',
        labelClassName: classes.linkLabel,
        hideHorizontalBorders: true,
        hideBottomBorderExceptLast: true,
        arrowClassName: classes.linkArrow,
        forceBackground: true,
      }}
    />
  )
}

export const LinkGrid: React.FC<
  LinkGridProps & {
    className?: string
  }
> = props => {
  const { className, linkGridFields, padding } = props

  const links = linkGridFields?.links
  const hasLinks = Array.isArray(links) && links.length > 0

  return (
    <BlockWrapper
      className={[className, classes.linkGrid].filter(Boolean).join(' ')}
      padding={padding}
      settings={linkGridFields?.settings}
    >
      <BackgroundGrid />
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
