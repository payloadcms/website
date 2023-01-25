'use client'

import * as React from 'react'

import Link from 'next/link'

import { Gutter } from '@components/Gutter'
import { Cell, Grid } from '@faceless-ui/css-grid'
import classes from './index.module.scss'

const basePath = '/dashboard/projects'

type ProjectSettingsLayoutType = {
  children: React.ReactNode
  params: {
    id: string
  }
}
const ProjectSettingsLayout = ({ children, params }: ProjectSettingsLayoutType) => {
  return (
    <Gutter className={classes.settingsLayout}>
      <Grid>
        <Cell cols={4}>
          <div className={classes.sidebarNav}>
            <Link href={`${basePath}/${params.id}/settings`}>Build Settings</Link>
            <Link href={`${basePath}/${params.id}/settings/environment-variables`}>
              Environment Variables
            </Link>
            <Link href={`${basePath}/${params.id}/settings/domain`}>Domain</Link>
            <Link href={`${basePath}/${params.id}/settings/ownership`}>Ownership</Link>
            <Link href={`${basePath}/${params.id}/settings/plan`}>Plan</Link>
            <Link href={`${basePath}/${params.id}/settings/billing`}>Billing</Link>
          </div>
        </Cell>

        <Cell start={5} cols={8}>
          {children}
        </Cell>
      </Grid>
    </Gutter>
  )
}

export default ProjectSettingsLayout
