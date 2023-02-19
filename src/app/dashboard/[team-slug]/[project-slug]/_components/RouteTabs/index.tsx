'use client'

import * as React from 'react'

import { Heading } from '@components/Heading'
import { usePathnameSegments } from '@root/utilities/use-pathname-segments'

import classes from './index.module.scss'

const tabRoutes = [
  {
    label: 'Overview',
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
    pathSegment: 'settings',
  },
]

export const RouteTabs: React.FC = () => {
  const [home, teamSlug, projectSlug, tabSlug] = usePathnameSegments()

  return (
    <div className={classes.tabs}>
      {tabRoutes.map(route => {
        const isActive = tabSlug === route.pathSegment

        return (
          <Heading
            key={route.label}
            className={[classes.tab, isActive && classes.active].filter(Boolean).join(' ')}
            href={`/${home}/${teamSlug}/${projectSlug}${
              route?.pathSegment ? `/${route.pathSegment}` : ''
            }`}
            element="h4"
          >
            {route.label}
          </Heading>
        )
      })}
    </div>
  )
}
