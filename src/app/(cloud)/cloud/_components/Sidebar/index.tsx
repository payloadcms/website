'use client'

import React from 'react'
import Link from 'next/link'

import { usePathname } from 'next/navigation'

import { EdgeScroll } from '@components/EdgeScroll/index.js'

import classes from './layout.module.scss'

export const Sidebar: React.FC<{
  routes: {
    label: string
    url?: string
  }[]
}> = props => {
  const { routes } = props
  const pathname = usePathname()

  return (
    <div className={classes.sidebarNav}>
      <EdgeScroll mobileOnly>
        {routes.map((route, index) => {
          const { url, label } = route
          const isActive = pathname === url

          return (
            <p
              key={route.label}
              className={[
                classes.sidebarNavItem,
                isActive && classes.active,
                index === routes.length - 1 && classes.lastItem,
              ]
                .filter(Boolean)
                .join(' ')}
            >
              <Link href={url || ''}>{label}</Link>
            </p>
          )
        })}
      </EdgeScroll>
    </div>
  )
}
