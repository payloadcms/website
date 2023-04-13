'use client'

import * as React from 'react'
import { notFound } from 'next/navigation'

import { useRouteData } from '../../context'

type ProjectLayoutType = {
  children: React.ReactNode
}

export const ProjectLayout = ({ children }: ProjectLayoutType) => {
  const { project, reloadProject } = useRouteData()

  React.useEffect(() => {
    reloadProject()
  }, [reloadProject])

  if (project === undefined) return null

  if (project === null) notFound()

  return <>{children}</>
}
