'use client'

import Breadcrumbs from '@components/Breadcrumbs'
import { Gutter } from '@components/Gutter'
import { RichText } from '@components/RichText'
import { Cell, Grid } from '@faceless-ui/css-grid'
import React from 'react'
import { Page } from '../../../payload-types'

import classes from './index.module.scss'

export const DefaultHero: React.FC<Page['hero']> = ({ pageLabel, richText, sidebarContent }) => {
  return (
    <Gutter>
      <div className={classes.defaultHero}>
        <Breadcrumbs
          items={[
            {
              label: pageLabel,
            },
          ]}
        />

        <Grid>
          <Cell cols={8} colsM={5} colsS={8}>
            <RichText className={classes.richText} content={richText} />
          </Cell>
          <Cell start={10} cols={4} startM={6} colsS={12} startS={1}>
            <RichText content={sidebarContent} />
          </Cell>
        </Grid>
      </div>
    </Gutter>
  )
}
