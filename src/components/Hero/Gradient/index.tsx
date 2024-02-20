'use client'

import React from 'react'

import { BackgroundGrid } from '@components/BackgroundGrid'
import { BlockWrapper } from '@components/BlockWrapper'
import { CMSLink } from '@components/CMSLink'
import { Gutter } from '@components/Gutter'
import { useGetHeroPadding } from '@components/Hero/useGetHeroPadding'
import { Media } from '@components/Media'
import MediaParallax from '@components/MediaParallax'
import { BlocksProp } from '@components/RenderBlocks'
import { RichText } from '@components/RichText'
import { Page } from '@root/payload-types'

import classes from './index.module.scss'

export const GradientHero: React.FC<
  Pick<
    Page['hero'],
    'richText' | 'images' | 'fullBackground' | 'links' | 'description' | 'theme'
  > & {
    breadcrumbs?: Page['breadcrumbs']
    firstContentBlock?: BlocksProp
  }
> = ({ richText, images, fullBackground, links, description, theme, firstContentBlock }) => {
  const padding = useGetHeroPadding(theme, firstContentBlock)

  return (
    <BlockWrapper settings={{ theme: 'dark' }} padding={{ ...padding, bottom: 'large' }}>
      {Boolean(fullBackground) && (
        <Media
          className={[classes.bgFull].filter(Boolean).join(' ')}
          src="/images/gradient-wide.jpg"
          alt=""
          width={1920}
          height={1080}
        />
      )}
      <BackgroundGrid zIndex={0} />
      <Gutter>
        <div className={[classes.wrapper, 'grid'].filter(Boolean).join(' ')}>
          <div
            className={[classes.sidebar, `cols-6`, 'cols-m-8 start-1'].filter(Boolean).join(' ')}
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
            />
          )}
          <div
            className={[classes.media, 'cols-9 start-8 cols-m-8 start-m-1']
              .filter(Boolean)
              .join(' ')}
          >
            {images && Array.isArray(images) && <MediaParallax media={images} />}
          </div>
        </div>
        <div className={classes.defaultHero}></div>
      </Gutter>
    </BlockWrapper>
  )
}
