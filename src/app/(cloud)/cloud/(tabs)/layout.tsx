import { Fragment } from 'react'
import { DashboardTabs } from '@cloud/_components/DashboardTabs'
import { cloudSlug } from '@cloud/slug'

import { Gutter } from '@components/Gutter'

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
