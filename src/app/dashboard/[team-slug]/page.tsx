'use client'

import * as React from 'react'

import { Gutter } from '@components/Gutter'
import { RouteTabs } from '../_components/RouteTabs'
import { useRouteData } from '../context'

export default () => {
  const { team } = useRouteData()

  return (
    <div>
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
        <h1>Projects</h1>
        <p>Coming soon...</p>
      </Gutter>
    </div>
  )
}
