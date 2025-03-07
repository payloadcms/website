'use client'

import { EdgeScroll } from '@components/EdgeScroll/index'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React from 'react'

import classes from './layout.module.scss'

export const Sidebar: React.FC<{
  routes: {
    label: string
    url?: string
  }[]
}> = (props) => {
  const { routes } = props
  const pathname = usePathname()

  return (
    <div className={classes.sidebarNav}>
      <EdgeScroll mobileOnly>
        {routes.map((route, index) => {
          const { label, url } = route
          const isActive = pathname === url

          return (
            <p
              className={[
                classes.sidebarNavItem,
                isActive && classes.active,
                index === routes.length - 1 && classes.lastItem,
              ]
                .filter(Boolean)
                .join(' ')}
              key={route.label}
            >
              <Link href={url || ''}>{label}</Link>
            </p>
          )
        })}
      </EdgeScroll>
    </div>
  )
}
