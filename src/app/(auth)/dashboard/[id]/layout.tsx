'use client'

import * as React from 'react'
import { usePathname } from 'next/navigation'

import { Breadcrumbs } from '@components/Breadcrumbs'
import { Gutter } from '@components/Gutter'
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

type ProjectLayoutType = {
  children: React.ReactNode
  params: {
    id: string
  }
}
const ProjectLayout = ({ children, params }: ProjectLayoutType) => {
  const pathname = usePathname()

  return (
    <React.Fragment>
      <Gutter className={classes.tabContainer}>
        <Breadcrumbs
          items={[
            {
              label: 'Projects',
              url: '/dashboard/projects',
            },
            {
              label: params.id,
              url: `/dashboard/${params.id}`,
            },
          ]}
        />

        <div className={classes.tabs}>
          {tabRoutes.map(route => {
            const routePath = `/dashboard/${params.id}/${route.pathSegment}`
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
      </Gutter>

      <Gutter>{children}</Gutter>
    </React.Fragment>
  )
}

export default ProjectLayout
