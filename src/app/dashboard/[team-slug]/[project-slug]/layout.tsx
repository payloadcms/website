'use client'

import * as React from 'react'
import { notFound } from 'next/navigation'

import { Gutter } from '@components/Gutter'
import { RouteTabs } from '../../_components/RouteTabs'
import { useRouteData } from '../../context'

import classes from './index.module.scss'

type ProjectLayoutType = {
  children: React.ReactNode
}

export default ({ children }: ProjectLayoutType) => {
  const { project, setProject } = useRouteData()

  React.useEffect(() => {
    return () => setProject(undefined)
  }, [setProject])

  if (project === undefined) return null

  if (project === null) notFound()

  return (
    <React.Fragment>
      <RouteTabs
        className={classes.tabContainer}
        routePrefix={`/dashboard/${
          typeof project.team === 'string' ? project.team : project?.team?.slug
        }/${project.slug}`}
        tabs={[
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
        ]}
      />
      <Gutter>{children}</Gutter>
    </React.Fragment>
  )
}
