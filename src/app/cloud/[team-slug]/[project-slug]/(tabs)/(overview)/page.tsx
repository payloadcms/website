'use client'

import * as React from 'react'
import { useRouteData } from '@cloud/context'

import { InfraOffline } from './infraOffline'
import { InfraOnline } from './infraOnline'

export default () => {
  const { project } = useRouteData()
  const { infraStatus } = project

  if (infraStatus === 'done') {
    return <InfraOnline />
  }

  return <InfraOffline />
}
