'use client'

import type { BlocksProp } from '@components/RenderBlocks/index'
import type { Page } from '@root/payload-types'

import { BackgroundGrid } from '@components/BackgroundGrid/index'
import { BlockWrapper } from '@components/BlockWrapper/index'
import { Breadcrumbs } from '@components/Breadcrumbs/index'
import { CMSLink } from '@components/CMSLink/index'
import { Gutter } from '@components/Gutter/index'
import { useGetHeroPadding } from '@components/Hero/useGetHeroPadding'
import { Media } from '@components/Media'
import { RichText } from '@components/RichText/index'
import React from 'react'

import classes from './index.module.scss'

export const CenteredContent: React.FC<
  {
    breadcrumbs?: Page['breadcrumbs']
    firstContentBlock?: BlocksProp
  } & Pick<Page['hero'], 'enableMedia' | 'links' | 'media' | 'richText' | 'theme'>
> = ({ breadcrumbs, enableMedia, firstContentBlock, links, media, richText, theme }) => {
  const padding = useGetHeroPadding(theme, firstContentBlock)

  return (
    <BlockWrapper hero padding={padding} settings={{ theme }}>
      <BackgroundGrid zIndex={0} />
      <Gutter>
        <div className={[classes.container, 'grid'].filter(Boolean).join(' ')}>
          <div
            className={[classes.content, 'cols-8 start-5 start-m-1 cols-m-8']
              .filter(Boolean)
              .join(' ')}
          >
            <div className={classes.richText}>
              <RichText content={richText} />
            </div>

            <div className={[classes.links].filter(Boolean).join(' ')}>
              {Array.isArray(links) &&
                links.map(({ link }, i) => {
                  return (
                    <CMSLink
                      key={i}
                      {...link}
                      buttonProps={{
                        hideBottomBorderExceptLast: true,
                        hideHorizontalBorders: true,
                      }}
                    />
                  )
                })}
            </div>
          </div>
          {enableMedia && media && typeof media !== 'string' && (
            <div
              className={[classes.mediaWrap, 'cols-16 start-1 cols-m-8'].filter(Boolean).join(' ')}
            >
              <Media resource={media} />
            </div>
          )}
        </div>
      </Gutter>
    </BlockWrapper>
  )
}
