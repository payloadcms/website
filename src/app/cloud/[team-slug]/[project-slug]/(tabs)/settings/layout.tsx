import * as React from 'react'
import { Sidebar } from '@cloud/_components/Sidebar'
import { cloudSlug } from '@cloud/slug'
import { Cell, Grid } from '@faceless-ui/css-grid'

import { Gutter } from '@components/Gutter'

import classes from './layout.module.scss'

const settingsSlug = 'settings'

export default async ({
  params: { 'team-slug': teamSlug, 'project-slug': projectSlug },
  children,
}) => {
  return (
    <Gutter>
      <Grid className={classes.gridWrap}>
        <Cell cols={3} start={1} colsS={8}>
          <Sidebar
            routes={[
              {
                label: 'General',
                url: `/${cloudSlug}/${teamSlug}/${projectSlug}/${settingsSlug}`,
              },
              {
                label: 'Environment Variables',
                url: `/${cloudSlug}/${teamSlug}/${projectSlug}/${settingsSlug}/environment-variables`,
              },
              {
                label: 'Domains',
                url: `/${cloudSlug}/${teamSlug}/${projectSlug}/${settingsSlug}/domains`,
              },
              {
                label: 'Email',
                url: `/${cloudSlug}/${teamSlug}/${projectSlug}/${settingsSlug}/email`,
              },
              {
                label: 'Ownership',
                url: `/${cloudSlug}/${teamSlug}/${projectSlug}/${settingsSlug}/ownership`,
              },
              {
                label: 'Plan',
                url: `/${cloudSlug}/${teamSlug}/${projectSlug}/${settingsSlug}/plan`,
              },
              {
                label: 'Billing',
                url: `/${cloudSlug}/${teamSlug}/${projectSlug}/${settingsSlug}/billing`,
              },
            ]}
          />
        </Cell>
        <Cell start={4} cols={9} startS={1}>
          {children}
        </Cell>
      </Grid>
    </Gutter>
  )
}
