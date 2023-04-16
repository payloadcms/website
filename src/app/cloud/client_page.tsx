'use client'

import React from 'react'
import { NewProjectBlock } from '@blocks/NewProject'
import { Cell, Grid } from '@faceless-ui/css-grid'
import { Text } from '@forms/fields/Text'

import { Button } from '@components/Button'
import { ProjectCard } from '@components/cards/ProjectCard'
import { Gutter } from '@components/Gutter'
import { LoadingShimmer } from '@components/LoadingShimmer'
import { TeamSelector } from '@components/TeamSelector'
import { useGetProjects } from '@root/utilities/use-cloud-api'

import classes from './index.module.scss'

export const CloudHomePage = () => {
  const [selectedTeam, setSelectedTeam] = React.useState<string | 'none'>()
  const [search, setSearch] = React.useState<string>('')
  const [hasLoaded, setHasLoaded] = React.useState<boolean>(false)

  const {
    isLoading,
    error,
    result: projects,
  } = useGetProjects({
    teams: selectedTeam ? [selectedTeam] : undefined,
    search,
  })

  React.useEffect(() => {
    if (isLoading === false) {
      setHasLoaded(true)
    }
  }, [isLoading])

  if (!hasLoaded) {
    return (
      <Gutter>
        <LoadingShimmer number={3} />
      </Gutter>
    )
  }

  if (hasLoaded && projects && projects.length === 0) {
    return <NewProjectBlock cardLeader="New" headingElement="h2" />
  }

  return (
    <Gutter>
      {error && <p className={classes.error}>{error}</p>}
      <div className={classes.controls}>
        <div className={classes.controlsBG} />
        <Text
          placeholder="Search projects"
          initialValue={search}
          onChange={setSearch}
          className={classes.search}
          fullWidth={false}
        />
        <TeamSelector
          onChange={incomingTeam => {
            setSelectedTeam(incomingTeam)
          }}
          className={classes.teamSelector}
          initialValue="none"
          allowEmpty
          label={false}
        />
        <Button
          appearance="primary"
          href="/new"
          label="New project"
          el="link"
          className={classes.createButton}
        />
      </div>
      {isLoading ? (
        <LoadingShimmer number={3} />
      ) : (
        <div className={classes.content}>
          {projects && projects.length === 0 && search?.length > 0 && (
            <p className={classes.noResults}>
              {"Your search didn't return any results, please try again."}
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
