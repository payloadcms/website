'use client'

import React from 'react'
import { Cell, Grid } from '@faceless-ui/css-grid'

import { Breadcrumbs } from '@components/Breadcrumbs'
import { CMSLink } from '@components/CMSLink'
import { Gutter } from '@components/Gutter'
import { Media } from '@components/Media'
import { RichText } from '@components/RichText'
import { Page } from '@root/payload-types'

import classes from './index.module.scss'

export const ContentMediaHero: React.FC<
  Pick<Page['hero'], 'richText' | 'media' | 'mediaWidth' | 'links'> & {
    breadcrumbs?: Page['breadcrumbs']
  }
> = ({ richText, media, mediaWidth, breadcrumbs, links }) => {
  return (
    <Gutter>
      <Grid className={mediaWidth === 'wide' ? classes.wideGrid : classes.grid}>
        <Cell start={1} cols={mediaWidth === 'wide' ? 5 : 7} colsM={8}>
          <Breadcrumbs items={breadcrumbs} />
          <RichText content={richText} />
          {Array.isArray(links) &&
            links.map(({ link }, i) => {
              return <CMSLink key={i} {...link} className={classes.link} />
            })}
        </Cell>
        {typeof media === 'object' && media !== null && (
          <Cell
            start={mediaWidth === 'wide' ? 4 : 8}
            startL={mediaWidth === 'wide' ? 6 : 8}
            startM={1}
            cols={mediaWidth === 'wide' ? 11 : 5}
            colsL={mediaWidth === 'wide' ? 9 : 6}
            colsM={8}
          >
            <div className={mediaWidth === 'wide' ? classes.wideMedia : classes.media}>
              <Media
                resource={media}
                sizes={`100vw, (max-width: 1920px) ${
                  mediaWidth === 'wide' ? '50vw' : '75vw'
                }, (max-width: 1024px) 100vw`}
              />
            </div>
          </Cell>
        )}
      </Grid>
      <div className={classes.defaultHero}></div>
    </Gutter>
  )
}
