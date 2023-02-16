'use client'

import { Button } from '@components/Button'
import { Gutter } from '@components/Gutter'
import { usePathnameSegments } from '@root/utilities/use-pathname-segments'
import { useRouteData } from './context'

export default function NotFound() {
  const [home, teamSlug, projectSlug] = usePathnameSegments()
  const { team, project } = useRouteData()

  if (team === null) {
    return (
      <Gutter>
        <h2>404: Team not found "{teamSlug}"</h2>
        <Button href={`/${home}`} label="View your teams" appearance="primary" />
      </Gutter>
    )
  }

  if (project === null) {
    return (
      <Gutter>
        <h2>404: Project not found "{projectSlug}"</h2>
        <Button href={`/${home}/${teamSlug}`} label="View team projects" appearance="primary" />
      </Gutter>
    )
  }

  return (
    <Gutter>
      <h2>404</h2>
      <Button href={`/${home}`} label="Back home" appearance="primary" />
    </Gutter>
  )
}
