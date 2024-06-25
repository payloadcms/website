'use client'

import React from 'react'

import { BackgroundGrid } from '@components/BackgroundGrid/index.js'
import { BlockWrapper } from '@components/BlockWrapper/index.js'
import { CMSLink } from '@components/CMSLink/index.js'
import { Gutter } from '@components/Gutter/index.js'
import { useGetHeroPadding } from '@components/Hero/useGetHeroPadding.js'
import { Media } from '@components/Media/index.js'
import MediaParallax from '@components/MediaParallax/index.js'
import { BlocksProp } from '@components/RenderBlocks/index.js'
import { RichText } from '@components/RichText/index.js'
import { Page } from '@root/payload-types.js'

import classes from './index.module.scss'

export const GradientHero: React.FC<
  Pick<
    Page['hero'],
    | 'richText'
    | 'images'
    | 'fullBackground'
    | 'links'
    | 'description'
    | 'theme'
    | 'enableBreadcrumbsBar'
  > & {
    breadcrumbs?: Page['breadcrumbs']
    firstContentBlock?: BlocksProp
  }
> = ({
  richText,
  images,
  fullBackground,
  links,
  description,
  theme: themeFromProps,
  enableBreadcrumbsBar,
  firstContentBlock,
}) => {
  const theme = fullBackground ? 'dark' : themeFromProps
  const padding = useGetHeroPadding(theme, firstContentBlock)

  return (
    <BlockWrapper settings={{ theme }} padding={{ top: 'small', bottom: 'small' }}>
      {Boolean(fullBackground) && (
        <Media
          className={[classes.bgFull, enableBreadcrumbsBar ? classes.hasBreadcrumbsEnabled : '']
            .filter(Boolean)
            .join(' ')}
          src="/images/background-shapes.webp"
          alt=""
          width={1920}
          height={1080}
          priority
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
            <RichText content={richText} className={[classes.richText].filter(Boolean).join(' ')} />
            <div className={classes.contentWrapper}>
              <RichText
                content={description}
                className={[classes.description].filter(Boolean).join(' ')}
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
          {!Boolean(fullBackground) && (
            <Media
              className={[classes.bgSquare, 'cols-8 start-9 start-m-1'].filter(Boolean).join(' ')}
              src="/images/gradient-square.jpg"
              alt=""
              width={800}
              height={800}
              priority
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
