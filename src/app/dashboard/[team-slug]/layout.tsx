'use client'

import * as React from 'react'
import { notFound } from 'next/navigation'

import { useRouteData } from '../context'

type ProjectLayoutType = {
  children: React.ReactNode
}

export default ({ children }: ProjectLayoutType) => {
  const { team, reloadTeam } = useRouteData()

  React.useEffect(() => {
    reloadTeam()
  }, [reloadTeam])

  if (team === undefined) return null

  if (team === null) notFound()

  return children
}
