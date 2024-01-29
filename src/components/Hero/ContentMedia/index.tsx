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
  Pick<Page['hero'], 'richText' | 'media' | 'links' | 'sidebarContent'> & {
    breadcrumbs?: Page['breadcrumbs']
  }
> = ({ richText, media, links, sidebarContent }) => {
  return (
    <Gutter>
      <div className={[classes.wrapper, 'grid'].filter(Boolean).join(' ')}>
        <BackgroundGrid ignoreGutter />
        <div className={[classes.sidebar, `cols-4`, 'cols-m-8 start-1'].filter(Boolean).join(' ')}>
          <RichText content={richText} className={[classes.richText].filter(Boolean).join(' ')} />

          <div className={[classes.linksWrapper].filter(Boolean).join(' ')}>
            <RichText
              content={sidebarContent}
              className={[classes.sidebarContent].filter(Boolean).join(' ')}
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
            className={[`start-7`, `start-l-7`, `cols-10`, `cols-l-10`, 'cols-m-8 start-m-1']
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
  )
}
