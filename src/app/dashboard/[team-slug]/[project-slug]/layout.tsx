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
  const { team, project, reloadProject } = useRouteData()

  React.useEffect(() => {
    reloadProject()
  }, [reloadProject])

  if (project === undefined) return null

  if (project === null) notFound()

  return (
    <React.Fragment>
      <RouteTabs
        className={classes.tabContainer}
        basePath={`/dashboard/${team.slug}/${project.slug}`}
        tabs={[
          {
            label: 'Overview',
          },
          {
            label: 'Logs',
            slug: 'logs',
          },
          {
            label: 'Database',
            slug: 'database',
          },
          {
            label: 'File Storage',
            slug: 'file-storage',
          },
          {
            label: 'Settings',
            slug: 'settings',
          },
        ]}
      />
      <Gutter>{children}</Gutter>
    </React.Fragment>
  )
}
