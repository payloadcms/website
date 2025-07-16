'use client'

import type { BlocksProp } from '@components/RenderBlocks/index'
import type { Page } from '@root/payload-types'

import { BackgroundGrid } from '@components/BackgroundGrid/index'
import { BlockWrapper } from '@components/BlockWrapper/index'
import { CMSLink } from '@components/CMSLink/index'
import { Gutter } from '@components/Gutter/index'
import { useGetHeroPadding } from '@components/Hero/useGetHeroPadding'
import { Media } from '@components/Media/index'
import MediaParallax from '@components/MediaParallax/index'
import { RichText } from '@components/RichText/index'
import React from 'react'

import classes from './index.module.scss'

export const GradientHero: React.FC<
  {
    breadcrumbs?: Page['breadcrumbs']
    firstContentBlock?: BlocksProp
  } & Pick<
    Page['hero'],
    | 'description'
    | 'enableBreadcrumbsBar'
    | 'fullBackground'
    | 'images'
    | 'links'
    | 'richText'
    | 'theme'
  >
> = ({
  description,
  enableBreadcrumbsBar,
  firstContentBlock,
  fullBackground,
  images,
  links,
  richText,
  theme: themeFromProps,
}) => {
  const theme = fullBackground ? 'dark' : themeFromProps
  const padding = useGetHeroPadding(theme, firstContentBlock)

  return (
    <BlockWrapper hero padding={{ bottom: 'small', top: 'small' }} settings={{ theme }}>
      {Boolean(fullBackground) && (
        <Media
          alt=""
          className={[classes.bgFull, enableBreadcrumbsBar ? classes.hasBreadcrumbsEnabled : '']
            .filter(Boolean)
            .join(' ')}
          height={1080}
          priority
          src="/images/background-shapes.webp"
          width={1920}
        />
      )}
      <BackgroundGrid className={classes.backgroundGrid} zIndex={0} />
      <Gutter>
        <div className={[classes.wrapper, 'grid'].filter(Boolean).join(' ')}>
          <div
            className={[
              classes.sidebar,
              fullBackground && classes.hasFullBackground,
              `cols-6`,
              'cols-m-8 start-1',
            ]
              .filter(Boolean)
              .join(' ')}
          >
            <RichText className={[classes.richText].filter(Boolean).join(' ')} content={richText} />
            <div className={classes.contentWrapper}>
              <RichText
                className={[classes.description].filter(Boolean).join(' ')}
                content={description}
              />

              <div className={[classes.linksWrapper].filter(Boolean).join(' ')}>
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
          </div>
          {!fullBackground && (
            <Media
              alt=""
              className={[classes.bgSquare, 'cols-8 start-9 start-m-1'].filter(Boolean).join(' ')}
              height={800}
              priority
              src="/images/gradient-square.jpg"
              width={800}
            />
          )}
          <div
            className={[classes.media, 'cols-9 start-8 cols-m-8 start-m-1']
              .filter(Boolean)
              .join(' ')}
          >
            {images && Array.isArray(images) && <MediaParallax media={images} priority />}
          </div>
        </div>
        <div className={classes.defaultHero}></div>
      </Gutter>
    </BlockWrapper>
  )
}
