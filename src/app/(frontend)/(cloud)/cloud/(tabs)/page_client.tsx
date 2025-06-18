'use client'

import type { Team, Template, User } from '@root/payload-cloud-types'

import { ProjectCard } from '@cloud/_components/ProjectCard/index'
import { TeamSelector } from '@cloud/_components/TeamSelector/index'
import { Gutter } from '@components/Gutter/index'
import { NewProjectBlock } from '@components/NewProject/index'
import { Pagination } from '@components/Pagination/index'
import { Text } from '@forms/fields/Text/index'
import { useAuth } from '@root/providers/Auth/index'
import useDebounce from '@root/utilities/use-debounce'
import Link from 'next/link'
import React, { useEffect } from 'react'

import type { ProjectsRes } from '../_api/fetchProjects'

import { fetchProjectsClient } from '../_api/fetchProjects'
import classes from './page.module.scss'

const delay = 500
const debounce = 350

export const CloudPage: React.FC<{
  initialState: ProjectsRes
  templates: Template[]
  user: User
}> = ({ initialState, templates }) => {
  const { user } = useAuth()
  const [selectedTeam, setSelectedTeam] = React.useState<'none' | string>()
  const prevSelectedTeam = React.useRef<'none' | string | undefined>(selectedTeam)

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
  // this will also prevent content flash if using `projectRes.docs.length` to conditionally render
  const [renderNewProjectBlock, setRenderNewProjectBlock] = React.useState<boolean>(
    initialState?.totalDocs === 0,
  )

  useEffect(() => {
    // keep a timer reference so that we can cancel the old request
    // this is if the old request takes longer than the debounce time
    if (requestRef.current) {
      clearTimeout(requestRef.current)
    }

    // only perform searches after the user has engaged with the search field or pagination
    // this will ensure this effect is accidentally run on initial load, etc
    // the only stable way of doing this is to explicitly set the `enableSearch` flag on these event handlers
    if (enableSearch) {
      setIsLoading(true)

      // reset the page back to 1 if the team or search has changed
      const searchChanged = prevSearch.current !== debouncedSearch
      if (searchChanged) {
        prevSearch.current = debouncedSearch
      }
      const teamChanged = prevSelectedTeam.current !== selectedTeam
      if (teamChanged) {
        prevSelectedTeam.current = selectedTeam
      }

      const doFetch = async () => {
        // give the illusion of loading, so that fast network connections appear to flash
        // this gives the user a visual indicator that something is happening
        const start = Date.now()

        // reduce user teams to an array of team IDs
        const userTeams =
          user?.teams?.map(({ team }) =>
            team && typeof team === 'object' && team !== null && 'id' in team ? team.id : team,
          ) || [].filter(Boolean)

        // filter 'none' from the selected teams array
        // select all user teams if no team is selected
        const teams = !selectedTeam || selectedTeam === 'none' ? userTeams : [selectedTeam]

        try {
          requestRef.current = setTimeout(async () => {
            const projectsRes = await fetchProjectsClient({
              page: searchChanged || teamChanged ? 1 : page,
              search: debouncedSearch,
              teamIDs: teams,
            })

            const end = Date.now()
            const diff = end - start

            // the request was too fast, so we'll add a delay to make it appear as if it took longer
            if (diff < delay) {
              await new Promise((resolve) => setTimeout(resolve, delay - diff))
            }

            setRenderNewProjectBlock(!debouncedSearch && projectsRes?.totalDocs === 0)
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
  )?.team as Team

  if (initialState?.totalDocs === 0) {
    return (
      <NewProjectBlock
        cardLeader="New"
        heading={
          selectedTeam ? `Team '${matchedTeam?.name}' has no projects` : `You have no projects`
        }
        teamSlug={matchedTeam?.slug}
        templates={templates}
      />
    )
  }

  const userHasEnterpriseTeam = user?.teams?.some(
    ({ team }) => typeof team !== 'string' && team?.isEnterprise === true,
  )

  return (
    <Gutter>
      {error && <p className={classes.error}>{error}</p>}
      <div className={['grid', classes.controls].join(' ')}>
        <Text
          className={[
            userHasEnterpriseTeam ? 'cols-8 cols-m-8' : 'cols-12 cols-m-8',
            classes.search,
          ].join(' ')}
          initialValue={search}
          onChange={(value: string) => {
            setSearch(value)
            setEnableSearch(true)
          }}
          placeholder="Search projects"
        />
        <TeamSelector
          allowEmpty
          className={[
            userHasEnterpriseTeam ? 'cols-6 cols-l-4 cols-m-4' : 'cols-4 cols-m-8',
            classes.teamSelector,
          ].join(' ')}
          initialValue="none"
          label={false}
          onChange={(incomingTeam) => {
            setSelectedTeam(incomingTeam?.id)
            setEnableSearch(true)
          }}
          user={user}
        />
        {userHasEnterpriseTeam && (
          <div className="cols-2 cols-l-4 cols-m-4 cols-s-4">
            <Link
              className={classes.createButton}
              href={`/new${matchedTeam?.slug ? `?team=${matchedTeam?.slug}` : ''}`}
            >
              New Project
            </Link>
          </div>
        )}
      </div>
      {(!renderNewProjectBlock || isLoading) && (
        <div className={classes.content}>
          {!isLoading && debouncedSearch && result?.totalDocs === 0 ? (
            <p className={classes.description}>
              {"Your search didn't return any results, please try again."}
            </p>
          ) : (
            <div className={['grid', classes.projects].join(' ')}>
              {cardArray?.map((project, index) => (
                <ProjectCard
                  className={classes.projectCard}
                  isLoading={isLoading}
                  key={project.id}
                  project={project}
                />
              ))}
            </div>
          )}
        </div>
      )}
      {result?.totalPages > 1 && (
        <Pagination
          className={classes.pagination}
          page={result?.page}
          setPage={(page) => {
            setPage(page)
            setEnableSearch(true)
          }}
          totalPages={result?.totalPages}
        />
      )}
    </Gutter>
  )
}
