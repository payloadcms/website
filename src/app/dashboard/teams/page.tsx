'use client'

import * as React from 'react'

import { RouteTabs } from '../_components/RouteTabs'

import classes from './page.module.scss'

export default () => {
  return (
    <div className={classes.teams}>
      <RouteTabs
        basePath="/dashboard"
        tabs={[
          {
            label: 'Projects',
          },
          {
            label: 'Teams',
            slug: 'teams',
          },
          {
            label: 'Settings',
            slug: 'settings',
          },
        ]}
      />
    </div>
  )
}
