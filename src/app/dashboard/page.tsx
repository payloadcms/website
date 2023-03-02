'use client'

import React, { Fragment } from 'react'
import { Cell, Grid } from '@faceless-ui/css-grid'
import Link from 'next/link'

import { Gutter } from '@components/Gutter'
import { LoadingShimmer } from '@components/LoadingShimmer'
import { ProjectRow } from '@components/ProjectRow'
import { TeamSelector } from '@components/TeamSelector'
import { Team } from '@root/payload-cloud-types'
import { useGetProjects } from '@root/utilities/use-get-projects'

import classes from './index.module.scss'

export default () => {
  const [selectedTeam, setSelectedTeam] = React.useState<Team>()

  const { loading, error, projects } = useGetProjects({
    selectedTeam,
    delay: 250,
  })

  return (
    <Gutter>
      <div className={classes.header}>
        <h1 className={classes.title}>All projects</h1>
        {/* <Button appearance="primary" href="/new" label="Create new project" el="link" /> */}
      </div>
      {error && <p className={classes.error}>{error}</p>}
      <Grid>
        <Cell cols={3} colsM={8} className={classes.sidebarCell}>
          <div className={classes.sidebar}>
            <TeamSelector onChange={setSelectedTeam} />
            <Link href="/logout">Logout</Link>
          </div>
        </Cell>
        <Cell cols={9} colsM={8}>
          {loading && <LoadingShimmer number={3} />}
          {!loading && (
            <Fragment>
              {projects && projects.length === 0 && (
                <p className={classes.noProjects}>
                  {"You don't have any projects yet, "}
                  <Link href="/new">create a new project</Link>
                  {' to get started.'}
                </p>
              )}
              {Array.isArray(projects) && projects.length > 0 && (
                <div className={classes.projects}>
                  {projects.map((project, index) => (
                    <ProjectRow key={index} project={project} />
                  ))}
                </div>
              )}
            </Fragment>
          )}
        </Cell>
      </Grid>
    </Gutter>
  )
}
