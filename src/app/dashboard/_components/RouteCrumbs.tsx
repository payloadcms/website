'use client'

import React from 'react'

import { Breadcrumbs } from '@components/Breadcrumbs'
import { Gutter } from '@components/Gutter'
import { useRouteData } from '../context'

export const RouteCrumbs: React.FC = () => {
  const { team, project } = useRouteData()

  const crumbs = [
    {
      label: 'Home',
      url: '/dashboard',
    },
  ]

  if (team) {
    crumbs.push({
      label: team.name,
      url: `/dashboard/${team.slug}`,
    })

    if (project) {
      crumbs.push({
        label: project.name,
        url: `/dashboard/${team.slug}/${project.slug}`,
      })
    }
  }

  return (
    <Gutter>
      <Breadcrumbs items={crumbs} />
    </Gutter>
  )
}
