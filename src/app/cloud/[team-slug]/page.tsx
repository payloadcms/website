'use client'

import React from 'react'
import { Cell, Grid } from '@faceless-ui/css-grid'
import { Text } from '@forms/fields/Text'
import Link from 'next/link'

import { Button } from '@components/Button'
import { ProjectCard } from '@components/cards/ProjectCard'
import { Gutter } from '@components/Gutter'
import { LoadingShimmer } from '@components/LoadingShimmer'
import { useGetProjects } from '@root/utilities/use-cloud'
import { useRouteData } from '../context'

import classes from './index.module.scss'

export default () => {
  const { team } = useRouteData()

  const [search, setSearch] = React.useState<string>('')

  const { isLoading, error, result: projects } = useGetProjects({ team, search })

  return (
    <Gutter>
      {error && <p className={classes.error}>{error}</p>}
      <Grid className={classes.controls}>
        <div className={classes.controlsBG} />
        <Cell cols={9}>
          <Text
            placeholder="Search projects"
            label="Search"
            initialValue={search}
            onChange={setSearch}
          />
        </Cell>
        <Cell cols={3}>
          <Button
            appearance="primary"
            href="/new"
            label="New project"
            el="link"
            className={classes.createButton}
          />
        </Cell>
      </Grid>
      {isLoading ? (
        <LoadingShimmer number={3} />
      ) : (
        <div className={classes.content}>
          {projects && projects.length === 0 && (
            <p className={classes.noProjects}>
              {"You don't have any projects yet, "}
              <Link href="/new">create a new project</Link>
              {' to get started.'}
            </p>
          )}
          {Array.isArray(projects) && projects.length > 0 && (
            <Grid className={classes.projects}>
              {projects.map((project, index) => (
                <Cell key={index} cols={4}>
                  <ProjectCard project={project} className={classes.projectCard} />
                </Cell>
              ))}
            </Grid>
          )}
        </div>
      )}
    </Gutter>
  )
}
