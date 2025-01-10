'use client'

import type { BlocksProp } from '@components/RenderBlocks/index.js'
import type { Page } from '@root/payload-types.js'

import { BackgroundGrid } from '@components/BackgroundGrid/index.js'
import { BlockWrapper } from '@components/BlockWrapper/index.js'
import { Breadcrumbs } from '@components/Breadcrumbs/index.js'
import { CMSLink } from '@components/CMSLink/index.js'
import { Gutter } from '@components/Gutter/index.js'
import { useGetHeroPadding } from '@components/Hero/useGetHeroPadding.js'
import { Media } from '@components/Media'
import { RichText } from '@components/RichText/index.js'
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
    <BlockWrapper padding={padding} settings={{ theme }}>
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
