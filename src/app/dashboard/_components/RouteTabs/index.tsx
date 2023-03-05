'use client'

import * as React from 'react'
import { usePathname } from 'next/navigation'

import { Gutter } from '@components/Gutter'
import { Heading } from '@components/Heading'
import { usePathnameSegments } from '@root/utilities/use-pathname-segments'

import classes from './index.module.scss'

type TabRoute = {
  label: string
  pathSegment?: string
}

export const RouteTabs: React.FC<{
  tabs: TabRoute[]
  routePrefix?: string
  className?: string
}> = props => {
  const { tabs, routePrefix, className } = props
  const pathname = usePathname()
  const segments = usePathnameSegments()
  const slug = segments[segments.length - 1]

  return (
    <div className={[classes.tabsContainer, className].filter(Boolean).join(' ')}>
      <Gutter>
        <div className={classes.tabs}>
          {tabs.map(route => {
            const isActive = route.pathSegment
              ? route.pathSegment === slug
              : routePrefix === pathname

            const href = routePrefix
              ? `${routePrefix}${route.pathSegment ? `/${route.pathSegment}` : ''}`
              : `/${route.pathSegment}`

            return (
              <Heading
                key={route.label}
                className={[classes.tab, isActive && classes.active].filter(Boolean).join(' ')}
                href={href}
                element="h5"
              >
                {route.label}
              </Heading>
            )
          })}
        </div>
      </Gutter>
    </div>
  )
}
