'use client'

import * as React from 'react'
import { Secret } from '@forms/fields/Secret/index.js'

import { Banner } from '@components/Banner/index.js'
import { Gutter } from '@components/Gutter/index.js'
import { Project, Team } from '@root/payload-cloud-types.js'

export const ProjectDatabasePage: React.FC<{
  project: Project
  team: Team
}> = ({ project, team }) => {
  const loadConnectionString = React.useCallback(async () => {
    const { value } = await fetch(
      `${process.env.NEXT_PUBLIC_CLOUD_CMS_URL}/api/projects/${project?.id}/atlas-connection`,
      {
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      },
    ).then(res => res.json())

    return value
  }, [project?.id])

  return (
    <Gutter>
      <Secret label="Mongo Connection String" loadSecret={loadConnectionString} readOnly />
      <Banner>
        <p>
          Backups, migration, and more is on its way. For now, if you need to take a backup, you can
          use commands like <code>mongodump</code> and <code>mongorestore</code> using your
          connection string above.
        </p>
      </Banner>
    </Gutter>
  )
}
