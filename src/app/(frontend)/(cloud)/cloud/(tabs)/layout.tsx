import { Fragment } from 'react'
import { DashboardTabs } from '@cloud/_components/DashboardTabs/index.js'
import { cloudSlug } from '@cloud/slug.js'

import { Gutter } from '@components/Gutter/index.js'

export default async props => {
  const { children } = props

  return (
    <Fragment>
      <Gutter>
        <h2>Cloud</h2>
        <DashboardTabs
          tabs={{
            [cloudSlug]: {
              href: `/${cloudSlug}`,
              label: 'Projects',
            },
            teams: {
              label: 'Teams',
              href: `/${cloudSlug}/teams`,
            },
            settings: {
              label: 'Settings',
              href: `/${cloudSlug}/settings`,
            },
          }}
        />
      </Gutter>
      {children}
    </Fragment>
  )
}
