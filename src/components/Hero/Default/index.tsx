'use client'

import React from 'react'
import { Cell, Grid } from '@faceless-ui/css-grid'

import { Breadcrumbs } from '@components/Breadcrumbs'
import { Gutter } from '@components/Gutter'
import { RichText } from '@components/RichText'
import { Page } from '@root/payload-types'

import classes from './index.module.scss'

export const DefaultHero: React.FC<
  Pick<Page['hero'], 'richText' | 'sidebarContent'> & {
    breadcrumbs?: Page['breadcrumbs']
  }
> = ({ richText, sidebarContent, breadcrumbs }) => {
  const withoutSidebar =
    !sidebarContent ||
    (sidebarContent.length === 1 &&
      Array.isArray(sidebarContent[0].children) &&
      sidebarContent[0].children?.length === 1 &&
      !sidebarContent[0].children[0].text)

  return (
    <Gutter>
      <div className={classes.defaultHero}>
        {breadcrumbs && <Breadcrumbs items={breadcrumbs} ellipsis={false} />}
        <Grid>
          <Cell cols={withoutSidebar ? 10 : 8} colsM={withoutSidebar ? 7 : 5} colsS={8}>
            <RichText className={classes.richText} content={richText} />
          </Cell>

          {!withoutSidebar && (
            <Cell start={10} cols={4} startM={6} colsS={12} startS={1}>
              <RichText content={sidebarContent} />
            </Cell>
          )}
        </Grid>
      </div>
    </Gutter>
  )
}
