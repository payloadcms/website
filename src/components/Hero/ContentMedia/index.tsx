'use client'

import { Breadcrumbs } from '@components/Breadcrumbs'
import { Gutter } from '@components/Gutter'
import { HeaderObserver } from '@components/HeaderObserver'
import { useTheme } from '@providers/Theme'
import { RichText } from '@components/RichText'
import { Cell, Grid } from '@faceless-ui/css-grid'
import React from 'react'
import { Page } from '@root/payload-types'
import { Media } from '@components/Media'
import classes from './index.module.scss'

export const ContentMediaHero: React.FC<
  Pick<Page['hero'], 'richText' | 'media'> & {
    breadcrumbs?: Page['breadcrumbs']
  }
> = ({ richText, media, breadcrumbs }) => {
  const theme = useTheme()

  return (
    <HeaderObserver color={theme} pullUp>
      <Gutter>
        <Grid>
          <Cell cols={7} colsM={8}>
            <Breadcrumbs items={breadcrumbs} />
            <RichText content={richText} />
          </Cell>
          {typeof media === 'object' && (
            <Cell cols={5} start={8} colsM={8} startM={1}>
              <div className={classes.media}>
                <Media resource={media} sizes="(max-width: 768px) 100vw, 33vw" />
              </div>
            </Cell>
          )}
        </Grid>
        <div className={classes.defaultHero}></div>
      </Gutter>
    </HeaderObserver>
  )
}
