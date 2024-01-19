'use client'

import * as React from 'react'
import { cloudSlug } from '@cloud/slug'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

import { EdgeScroll } from '@components/EdgeScroll'
import { Gutter } from '@components/Gutter'
import { usePathnameSegments } from '@root/utilities/use-pathname-segments'

import classes from './layout.module.scss'

type ProjectSettingsLayoutType = {
  children: React.ReactNode
}

export default ({ children }: ProjectSettingsLayoutType) => {
  const [, settingsTab] = usePathnameSegments()
  const pathname = usePathname()

  const sidebarNavRoutes = [
    {
      label: 'Account',
      url: `/${cloudSlug}/${settingsTab}`,
    },
    {
      label: 'Logout',
      url: `/logout`,
    },
  ]

  return (
    <Gutter>
      <div className={[classes.gridWrap, 'grid'].filter(Boolean).join(' ')}>
        <div
          cols={3}
          start={1}
          colsS={8}
          className={['cols-4 start-1 cols-s-8'].filter(Boolean).join(' ')}
        >
          <div className={classes.sidebarNav}>
            <EdgeScroll mobileOnly>
              {sidebarNavRoutes.map((route, index) => {
                const isActive = pathname === route.url

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
                    <Link href={route.url}>{route.label}</Link>
                  </p>
                )
              })}
            </EdgeScroll>
          </div>
        </div>
        <div
          start={4}
          cols={9}
          startS={1}
          className={['cols-10 start-6 start-s-1'].filter(Boolean).join(' ')}
        >
          {children}
        </div>
      </div>
    </Gutter>
  )
}
