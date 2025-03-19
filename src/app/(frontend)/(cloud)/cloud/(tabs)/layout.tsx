import { DashboardTabs } from '@cloud/_components/DashboardTabs/index'
import { cloudSlug } from '@cloud/slug'
import { Gutter } from '@components/Gutter/index'
import { Fragment } from 'react'

export default async (props) => {
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
            settings: {
              href: `/${cloudSlug}/settings`,
              label: 'Settings',
            },
            teams: {
              href: `/${cloudSlug}/teams`,
              label: 'Teams',
            },
          }}
        />
      </Gutter>
      {children}
    </Fragment>
  )
}
