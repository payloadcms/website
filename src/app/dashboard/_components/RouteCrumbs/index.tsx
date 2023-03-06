'use client'

import React from 'react'

import { Breadcrumbs } from '@components/Breadcrumbs'
import { Gutter } from '@components/Gutter'
import { usePathnameSegments } from '@root/utilities/use-pathname-segments'
import { useRouteData } from '../../context'

export const RouteCrumbs: React.FC = () => {
  const [_, teamSlug, projectSlug] = usePathnameSegments() // eslint-disable-line no-unused-vars
  const { team, project } = useRouteData()

  const crumbs = [
    {
      label: 'Home',
      url: '/dashboard',
    },
  ]

  if (teamSlug && team) {
    crumbs.push({
      label: team.name,
      url: `/dashboard/${teamSlug}`,
    })

    if (projectSlug && project) {
      crumbs.push({
        label: project.name,
        url: `/dashboard/${teamSlug}/${projectSlug}`,
      })
    }
  }

  return (
    <Gutter>
      <Breadcrumbs items={crumbs} />
    </Gutter>
  )
}
