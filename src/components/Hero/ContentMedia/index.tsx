'use client'

import type { BlocksProp } from '@components/RenderBlocks/index'
import type { Page } from '@root/payload-types'

import { BackgroundGrid } from '@components/BackgroundGrid/index'
import { BlockWrapper } from '@components/BlockWrapper/index'
import { CMSLink } from '@components/CMSLink/index'
import { Gutter } from '@components/Gutter/index'
import { useGetHeroPadding } from '@components/Hero/useGetHeroPadding'
import { Media } from '@components/Media/index'
import { RichText } from '@components/RichText/index'
import React from 'react'

import classes from './index.module.scss'

export const ContentMediaHero: React.FC<
  {
    breadcrumbs?: Page['breadcrumbs']
    firstContentBlock?: BlocksProp
  } & Pick<Page['hero'], 'description' | 'links' | 'media' | 'richText' | 'theme'>
> = ({ description, firstContentBlock, links, media, richText, theme }) => {
  const padding = useGetHeroPadding(theme, firstContentBlock)

  return (
    <BlockWrapper hero padding={padding} settings={{ theme }}>
      <BackgroundGrid zIndex={0} />
      <Gutter>
        <div className={[classes.wrapper, 'grid'].filter(Boolean).join(' ')}>
          <div
            className={[classes.sidebar, `cols-4`, 'cols-m-8 start-1'].filter(Boolean).join(' ')}
          >
            <RichText className={[classes.richText].filter(Boolean).join(' ')} content={richText} />

            <div className={[classes.linksWrapper].filter(Boolean).join(' ')}>
              <RichText
                className={[classes.description].filter(Boolean).join(' ')}
                content={description}
              />

              {Array.isArray(links) &&
                links.map(({ link }, i) => {
                  return (
                    <CMSLink
                      key={i}
                      {...link}
                      buttonProps={{
                        hideHorizontalBorders: true,
                      }}
                      className={[classes.link, 'cols-12 start-1'].filter(Boolean).join(' ')}
                    />
                  )
                })}
            </div>
          </div>
          {typeof media === 'object' && media !== null && (
            <div
              className={[classes.mediaWrapper, `start-7`, `cols-10`, 'cols-m-8 start-m-1']
                .filter(Boolean)
                .join(' ')}
            >
              <div className={classes.media}>
                <Media
                  resource={media}
                  sizes={`100vw, (max-width: 1920px) 75vw, (max-width: 1024px) 100vw`}
                />
              </div>
            </div>
          )}
        </div>
        <div className={classes.defaultHero}></div>
      </Gutter>
    </BlockWrapper>
  )
}
