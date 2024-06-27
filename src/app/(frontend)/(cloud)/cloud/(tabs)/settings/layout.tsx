'use client'

import * as React from 'react'
import { cloudSlug } from '@cloud/slug.js'
import Link from 'next/link'

import { usePathname } from 'next/navigation'

import { EdgeScroll } from '@components/EdgeScroll/index.js'
import { Gutter } from '@components/Gutter/index.js'
import { usePathnameSegments } from '@root/utilities/use-pathname-segments.js'

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
    <Gutter className="grid">
      <div className="cols-4 cols-m-8">
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
      <div className="cols-12">{children}</div>
    </Gutter>
  )
}
