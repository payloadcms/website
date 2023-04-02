'use client'

import * as React from 'react'
import { useRouteData } from '@cloud/context'
import { Cell, Grid } from '@faceless-ui/css-grid'
import { Secret } from '@forms/fields/Secret'

import { Banner } from '@components/Banner'
import { ExtendedBackground } from '@root/app/_components/ExtendedBackground'

import classes from './index.module.scss'

export default () => {
  const { project } = useRouteData()

  const loadConnectionString = React.useCallback(async () => {
    const { value } = await fetch(
      `${process.env.NEXT_PUBLIC_CLOUD_CMS_URL}/api/projects/${project.id}/atlas-connection`,
      {
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      },
    ).then(res => res.json())

    return value
  }, [project.id])

  return (
    <Grid>
      <Cell start={1} colsXL={12} colsL={12}>
        <ExtendedBackground
          pixels
          upperChildren={
            <Secret label="Mongo Connection String" loadSecret={loadConnectionString} />
          }
        />
        <Banner>
          <p>
            Backups, migration, and more is on its way. For now, if you need to take a backup, you
            can use commands like <code>mongodump</code> and <code>mongorestore</code> using your
            connection string above.
          </p>
        </Banner>
      </Cell>
    </Grid>
  )
}
