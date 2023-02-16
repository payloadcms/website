'use client'

import * as React from 'react'
import { notFound } from 'next/navigation'

import { Gutter } from '@components/Gutter'
import { useRouteData } from '../../context'
import { RouteTabs } from './_components/RouteTabs'

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
      <Gutter className={classes.tabContainer}>
        <RouteTabs />
      </Gutter>

      <Gutter>{children}</Gutter>
    </React.Fragment>
  )
}
