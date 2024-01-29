'use client'

import React from 'react'

import { BackgroundGrid } from '@components/BackgroundGrid'
import { Breadcrumbs } from '@components/Breadcrumbs'
import { CMSLink } from '@components/CMSLink'
import { Gutter } from '@components/Gutter'
import { Media } from '@components/Media'
import { RichText } from '@components/RichText'
import { Page } from '@root/payload-types'

import classes from './index.module.scss'

export const ContentMediaHero: React.FC<
  Pick<Page['hero'], 'richText' | 'media' | 'mediaWidth' | 'links' | 'sidebarContent'> & {
    breadcrumbs?: Page['breadcrumbs']
  }
> = ({ richText, media, mediaWidth, links, sidebarContent }) => {
  return (
    <Gutter>
      <div
        className={[
          classes.wrapper,
          mediaWidth === 'wide' ? classes.wideGrid : classes.normalGrid,
          'grid',
        ]
          .filter(Boolean)
          .join(' ')}
      >
        <BackgroundGrid ignoreGutter />
        <div
          className={[
            `cols-${mediaWidth === 'wide' ? 4 : 7}`,
            `cols-l-${mediaWidth === 'wide' ? 4 : 7}`,
            'cols-m-8 start-1',
            'grid',
          ]
            .filter(Boolean)
            .join(' ')}
        >
          <RichText
            content={richText}
            className={[classes.richText, 'cols-8 start-1'].filter(Boolean).join(' ')}
          />

          <div
            className={[classes.linksWrapper, 'cols-16 cols-m-8 start-1'].filter(Boolean).join(' ')}
          >
            <RichText
              content={sidebarContent}
              className={[classes.sidebarContent, 'cols-8 start-1'].filter(Boolean).join(' ')}
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
            className={[
              `start-${mediaWidth === 'wide' ? 7 : 10}`,
              `start-l-${mediaWidth === 'wide' ? 7 : 10}`,
              `cols-${mediaWidth === 'wide' ? 10 : 7}`,
              `cols-l-${mediaWidth === 'wide' ? 10 : 7}`,
              'cols-m-8 start-m-1',
            ]
              .filter(Boolean)
              .join(' ')}
          >
            <div className={mediaWidth === 'wide' ? classes.wideMedia : classes.media}>
              <Media
                resource={media}
                sizes={`100vw, (max-width: 1920px) ${
                  mediaWidth === 'wide' ? '50vw' : '75vw'
                }, (max-width: 1024px) 100vw`}
              />
            </div>
          </div>
        )}
      </div>
      <div className={classes.defaultHero}></div>
    </Gutter>
  )
}
