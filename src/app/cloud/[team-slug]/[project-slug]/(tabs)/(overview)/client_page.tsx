'use client'

import * as React from 'react'
import { useRouteData } from '@cloud/context'

import { InfraOffline } from './infraOffline'
import { InfraOnline } from './infraOnline'

export const ProjectOverviewPage = () => {
  const { project } = useRouteData()

  if (project?.infraStatus === 'done') {
    return <InfraOnline />
  }

  return <InfraOffline />
}
