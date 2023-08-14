'use client'

import React, { useEffect } from 'react'
import { Cell, Grid } from '@faceless-ui/css-grid'
import { Text } from '@forms/fields/Text'

import { Button } from '@components/Button'
import { ProjectCard } from '@components/cards/ProjectCard'
import { Gutter } from '@components/Gutter'
import { Pagination } from '@components/Pagination'
import { TeamSelector } from '@components/TeamSelector'
import { Team, Template, User } from '@root/payload-cloud-types'
import { useAuth } from '@root/providers/Auth'
import useDebounce from '@root/utilities/use-debounce'
import { NewProjectBlock } from '../../_components/NewProject'
import { fetchProjectsClient, ProjectsRes } from '../_api/fetchProjects'

import classes from './page.module.scss'

const delay = 500
const debounce = 350

export const CloudPage: React.FC<{
  initialState: ProjectsRes
  user: User
  templates: Template[]
}> = ({ initialState, templates }) => {
  const { user } = useAuth()
  const [selectedTeam, setSelectedTeam] = React.useState<string | 'none'>()
  const prevSelectedTeam = React.useRef<string | 'none' | undefined>(selectedTeam)

  const [result, setResult] = React.useState<ProjectsRes>(initialState)
  const [page, setPage] = React.useState<number>(initialState?.page || 1)
  const [search, setSearch] = React.useState<string>('')
  const debouncedSearch = useDebounce(search, debounce)
  const prevSearch = React.useRef<string>(debouncedSearch)
  const [isLoading, setIsLoading] = React.useState<boolean>(false)
  const [error, setError] = React.useState<string>('')
  const [enableSearch, setEnableSearch] = React.useState<boolean>(false)
  const requestRef = React.useRef<NodeJS.Timeout | null>(null)
  // on initial load, we'll know whether or not to render the `NewProjectBlock`
  // this will prevent subsequent searches from showing the `NewProjectBlock`
  const [renderNewProjectBlock] = React.useState<boolean>(initialState?.totalDocs === 0)

  useEffect(() => {
    // keep a timer reference so that we can cancel the old request
    // this is if the old request takes longer than the debounce time
    if (requestRef.current) clearTimeout(requestRef.current)

    // only perform searches after the user has engaged with the search field or pagination
    // this will ensure this effect is accidentally run on initial load, etc
    // the only stable way of doing this is to explicitly set the `enableSearch` flag on these event handlers
    if (enableSearch) {
      setIsLoading(true)

      // reset the page back to 1 if the team or search has changed
      const searchChanged = prevSearch.current !== debouncedSearch
      if (searchChanged) prevSearch.current = debouncedSearch
      const teamChanged = prevSelectedTeam.current !== selectedTeam
      if (teamChanged) prevSelectedTeam.current = selectedTeam

      const doFetch = async () => {
        // give the illusion of loading, so that fast network connections appear to flash
        // this gives the user a visual indicator that something is happening
        const start = Date.now()

        // reduce user teams to an array of team IDs
        const userTeams =
          user?.teams?.map(({ team }) =>
            team && typeof team === 'object' && team !== null && 'id' in team ? team.id : team,
          ) || [].filter(Boolean) // eslint-disable-line function-paren-newline

        // filter 'none' from the selected teams array
        // select all user teams if no team is selected
        const teams = !selectedTeam || selectedTeam === 'none' ? userTeams : [selectedTeam]

        try {
          requestRef.current = setTimeout(async () => {
            const projectsRes = await fetchProjectsClient({
              teamIDs: teams,
              page: searchChanged || teamChanged ? 1 : page,
              search: debouncedSearch,
            })

            const end = Date.now()
            const diff = end - start

            // the request was too fast, so we'll add a delay to make it appear as if it took longer
            if (diff < delay) {
              await new Promise(resolve => setTimeout(resolve, delay - diff))
            }

            setResult(projectsRes)
            setIsLoading(false)
          }, 0)
        } catch (error) {
          setError(error.message || 'Something went wrong')
        }
      }
      doFetch()
    }
  }, [page, debouncedSearch, selectedTeam, enableSearch, user])

  // this will prevent layout shift, where we display loading card states on the screen in place of real data
  // to do this, we'll map an array of loading cards for the exactly number of cards that we expect to render
  // starting with the number of results from the API, the falling back to the limit used in the request
  const cardArray = isLoading
    ? Array.from(Array(result?.docs?.length || result?.limit).keys())
    : result?.docs || []

  const matchedTeam = user?.teams?.find(({ team }) =>
    typeof team === 'string' ? team === selectedTeam : team?.id === selectedTeam,
  )?.team as Team //eslint-disable-line function-paren-newline

  if (renderNewProjectBlock) {
    return (
      <NewProjectBlock
        heading={
          selectedTeam ? `Team '${matchedTeam?.name}' has no projects` : `You have no projects`
        }
        cardLeader="New"
        headingElement="h4"
        teamSlug={matchedTeam?.slug}
        templates={templates}
      />
    )
  }

  return (
    <Gutter>
      {error && <p className={classes.error}>{error}</p>}
      <div className={classes.controls}>
        <div className={classes.controlsBG} />
        <Text
          placeholder="Search projects"
          initialValue={search}
          onChange={(value: string) => {
            setSearch(value)
            setEnableSearch(true)
          }}
          className={classes.search}
          fullWidth={false}
        />
        <TeamSelector
          onChange={incomingTeam => {
            setSelectedTeam(incomingTeam?.id)
            setEnableSearch(true)
          }}
          className={classes.teamSelector}
          initialValue="none"
          allowEmpty
          label={false}
        />
        <Button
          appearance="primary"
          href={`/new${matchedTeam?.slug ? `?team=${matchedTeam?.slug}` : ''}`}
          label="New project"
          el="link"
          className={classes.createButton}
        />
      </div>
      <div className={classes.content}>
        {!isLoading && debouncedSearch && result?.totalDocs === 0 ? (
          <p className={classes.description}>
            {"Your search didn't return any results, please try again."}
          </p>
        ) : (
          <Grid className={classes.projects}>
            {cardArray?.map((project, index) => (
              <Cell key={index} cols={4}>
                <ProjectCard
                  project={project}
                  className={classes.projectCard}
                  isLoading={isLoading}
                />
              </Cell>
            ))}
          </Grid>
        )}
      </div>
      {result?.totalPages > 1 && (
        <Pagination
          className={classes.pagination}
          page={result?.page}
          totalPages={result?.totalPages}
          setPage={page => {
            setPage(page)
            setEnableSearch(true)
          }}
        />
      )}
    </Gutter>
  )
}
