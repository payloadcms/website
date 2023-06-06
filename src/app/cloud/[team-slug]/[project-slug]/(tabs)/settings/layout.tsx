'use client'

import * as React from 'react'
import { Cell, Grid } from '@faceless-ui/css-grid'
import Link from 'next/link'

import { EdgeScroll } from '@components/EdgeScroll'
import { Gutter } from '@components/Gutter'
import { usePathnameSegments } from '@root/utilities/use-pathname-segments'

import classes from './index.module.scss'

const sidebarNavRoutes = [
  {
    label: 'Build Settings',
  },
  {
    label: 'Environment Variables',
    slug: 'environment-variables',
  },
  {
    label: 'Domains',
    slug: 'domains',
  },
  {
    label: 'Email',
    slug: 'email',
  },
  {
    label: 'Ownership',
    slug: 'ownership',
  },
  {
    label: 'Plan',
    slug: 'plan',
  },
  {
    label: 'Billing',
    slug: 'billing',
  },
]

type ProjectSettingsLayoutType = {
  children: React.ReactNode
}
export default ({ children }: ProjectSettingsLayoutType) => {
  const [home, teamSlug, projectSlug, settingsTab, settingSlug] = usePathnameSegments()

  return (
    <Gutter>
      <Grid className={classes.gridWrap}>
        <Cell cols={3} start={1} colsS={8}>
          <div className={classes.sidebarNav}>
            <EdgeScroll mobileOnly>
              {sidebarNavRoutes.map((route, index) => {
                const isActive = settingSlug === route?.slug

                return (
                  <p
                    key={route.label}
                    className={[
                      classes.sidebarNavItem,
                      isActive && classes.active,
                      index === sidebarNavRoutes.length - 1 && classes.lastItem,
                    ]
                      .filter(Boolean)
                      .join(' ')}
                  >
                    <Link
                      href={`/${home}/${teamSlug}/${projectSlug}/${settingsTab}${
                        route?.slug ? `/${route.slug}` : ''
                      }`}
                    >
                      {route.label}
                    </Link>
                  </p>
                )
              })}
            </EdgeScroll>
          </div>
        </Cell>

        <Cell start={4} cols={9} startS={1}>
          {children}
        </Cell>
      </Grid>
    </Gutter>
  )
}
