'use client'

import * as React from 'react'

import { HeaderObserver } from '@components/HeaderObserver'
import { useTheme } from '@providers/Theme'
import { Gutter } from '@components/Gutter'
import { usePathname } from 'next/navigation'
import { Breadcrumbs } from '@components/Breadcrumbs'
import { Heading } from '@components/Heading'

import classes from './index.module.scss'

const tabRoutes = [
  {
    label: 'Overview',
    path: 'overview',
  },
  {
    label: 'Logs',
    path: 'logs',
  },
  {
    label: 'Database',
    path: 'database',
  },
  {
    label: 'File Storage',
    path: 'file-storage',
  },
  {
    label: 'Settings',
    path: 'settings/build-settings',
  },
]

type ProjectLayoutType = {
  children: React.ReactNode
  params: {
    id: string
  }
}
const ProjectLayout = ({ children, params }: ProjectLayoutType) => {
  const theme = useTheme()
  const pathname = usePathname()

  return (
    <HeaderObserver color={theme} pullUp>
      <Gutter className={classes.tabsGutter}>
        <Breadcrumbs
          items={[
            {
              label: 'Projects',
              url: '/dashboard/projects',
            },
            {
              label: params.id,
              url: `/dashboard/projects/${params.id}`,
            },
          ]}
        />

        <div className={classes.tabsContainer}>
          {tabRoutes.map(route => {
            const routePath = `/dashboard/projects/${params.id}/${route.path}`
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
    </HeaderObserver>
  )
}

export default ProjectLayout
