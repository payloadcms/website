'use client'

import React from 'react'

import { BackgroundGrid } from '@components/BackgroundGrid'
import { Breadcrumbs } from '@components/Breadcrumbs'
import { CMSLink } from '@components/CMSLink'
import { Gutter } from '@components/Gutter'
import { RichText } from '@components/RichText'
import { Page } from '@root/payload-types'

import classes from './index.module.scss'

export const CenteredContent: React.FC<
  Pick<Page['hero'], 'richText' | 'links'> & {
    breadcrumbs?: Page['breadcrumbs']
  }
> = ({ richText, links, breadcrumbs }) => {
  return (
    <Gutter>
      <div className={[classes.container, 'grid'].filter(Boolean).join(' ')}>
        <BackgroundGrid ignoreGutter />
        <div
          className={[classes.content, 'cols-8 start-5 start-m-1 cols-m-8']
            .filter(Boolean)
            .join(' ')}
        >
          {breadcrumbs && (
            <Breadcrumbs items={breadcrumbs} ellipsis={false} className={classes.label} />
          )}
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
                      hideHorizontalBorders: true,
                      hideBottomBorderExceptLast: true,
                    }}
                    className={[classes.link, 'cols-12 start-1'].filter(Boolean).join(' ')}
                  />
                )
              })}
          </div>
        </div>
      </div>
    </Gutter>
  )
}
