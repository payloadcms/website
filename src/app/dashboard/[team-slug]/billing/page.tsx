'use client'

import * as React from 'react'

import { Gutter } from '@components/Gutter'
import { RouteTabs } from '../../_components/RouteTabs'
import { useRouteData } from '../../context'

import classes from './page.module.scss'

export default () => {
  const { team } = useRouteData()

  return (
    <div className={classes.settings}>
      <RouteTabs
        basePath={`/dashboard/${team.slug}`}
        tabs={[
          {
            label: 'Projects',
          },
          {
            label: 'Billing',
            slug: 'billing',
          },
          {
            label: 'Settings',
            slug: 'settings',
          },
        ]}
      />
      <Gutter>
        <h1>Billing</h1>
        <p>Coming soon...</p>
      </Gutter>
    </div>
  )
}
