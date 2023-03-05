'use client'

import * as React from 'react'

import { RouteTabs } from '../_components/RouteTabs'

import classes from './page.module.scss'

export default () => {
  return (
    <div className={classes.settings}>
      <RouteTabs
        routePrefix="/dashboard"
        tabs={[
          {
            label: 'Projects',
          },
          {
            label: 'Teams',
            pathSegment: 'teams',
          },
          {
            label: 'Settings',
            pathSegment: 'settings',
          },
        ]}
      />
    </div>
  )
}
