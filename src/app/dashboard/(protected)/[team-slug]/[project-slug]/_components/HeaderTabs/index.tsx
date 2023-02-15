'use client'

import * as React from 'react'
import { usePathname } from 'next/navigation'

import { Heading } from '@components/Heading'

import classes from './index.module.scss'

const tabRoutes = [
  {
    label: 'Overview',
    pathSegment: 'overview',
  },
  {
    label: 'Logs',
    pathSegment: 'logs',
  },
  {
    label: 'Database',
    pathSegment: 'database',
  },
  {
    label: 'File Storage',
    pathSegment: 'file-storage',
  },
  {
    label: 'Settings',
    pathSegment: 'settings/build-settings',
  },
]

type HeaderTabsProps = {
  parentPath: string
}
export const HeaderTabs: React.FC<HeaderTabsProps> = ({ parentPath }) => {
  const pathname = usePathname()

  return (
    <div className={classes.tabs}>
      {tabRoutes.map(route => {
        const routePath = `${parentPath}/${route.pathSegment}`
        const isActive = pathname.startsWith(routePath)

        return (
          <Heading
            key={route.label}
            className={[classes.tab, isActive && classes.active].filter(Boolean).join(' ')}
            href={routePath}
            element="h4"
          >
            {route.label}
          </Heading>
        )
      })}
    </div>
  )
}
