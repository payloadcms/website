'use client'

import * as React from 'react'
import { Cell, Grid } from '@faceless-ui/css-grid'
import Link from 'next/link'

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
    <Grid>
      <Cell cols={3} start={1}>
        <div className={classes.sidebarNav}>
          {sidebarNavRoutes.map(route => {
            const isActive = settingSlug === route?.slug

            return (
              <p
                key={route.label}
                className={[classes.sidebarNavItem, isActive && classes.active]
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
        </div>
      </Cell>

      <Cell start={4} cols={9} startS={1}>
        {children}
      </Cell>
    </Grid>
  )
}
