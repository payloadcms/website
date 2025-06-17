import { DashboardTabs } from '@cloud/_components/DashboardTabs/index'
import { cloudSlug } from '@cloud/slug'
import { Banner } from '@components/Banner'
import { Gutter } from '@components/Gutter/index'
import { ArrowIcon } from '@icons/ArrowIcon'
import Link from 'next/link'
import { Fragment } from 'react'

export default async (props) => {
  const { children } = props

  return (
    <Fragment>
      <Gutter>
        <h2>Cloud</h2>
        <Banner type="success">
          We're joining Figma! During this transition, new signups are paused. Existing projects
          continue running normally.&nbsp;&nbsp;
          <Link href="/payload-has-joined-figma">Read more</Link>
          &nbsp;&nbsp;
          <ArrowIcon />
        </Banner>
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
