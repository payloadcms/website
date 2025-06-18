'use client'

import type { ProjectsRes } from '@cloud/_api/fetchProjects'
import type { TeamWithCustomer } from '@cloud/_api/fetchTeam'
import type { Template } from '@root/payload-cloud-types'

import { fetchProjectsClient } from '@cloud/_api/fetchProjects'
import { ProjectCard } from '@cloud/_components/ProjectCard/index'
import { Gutter } from '@components/Gutter/index'
import { NewProjectBlock } from '@components/NewProject/index'
import { Pagination } from '@components/Pagination/index'
import { Text } from '@forms/fields/Text/index'
import useDebounce from '@root/utilities/use-debounce'
import Link from 'next/link'
import React, { useEffect } from 'react'

import classes from './page.module.scss'

const delay = 500
const debounce = 350

export const TeamPage: React.FC<{
  initialState: ProjectsRes
  team: TeamWithCustomer
  templates?: Template[]
}> = ({ initialState, team, templates }) => {
  const [result, setResult] = React.useState<ProjectsRes>(initialState)
  const [page, setPage] = React.useState<number>(initialState?.page || 1)
  const [search, setSearch] = React.useState<string>('')
  const debouncedSearch = useDebounce(search, debounce)
  const searchRef = React.useRef<string>(debouncedSearch)
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
    if (requestRef.current) {
      clearTimeout(requestRef.current)
    }

    // only perform searches after the user has engaged with the search field or pagination
    // the only stable way of doing this is to explicitly set the `enableSearch` flag on these event handlers
    if (enableSearch) {
      setIsLoading(true)

      // if the search changed, reset the page back to 1
      const searchChanged = searchRef.current !== debouncedSearch
      if (searchChanged) {
        searchRef.current = debouncedSearch
      }

      const doFetch = async () => {
        // give the illusion of loading, so that fast network connections appear to flash
        // this gives the user a visual indicator that something is happening
        const start = Date.now()

        try {
          requestRef.current = setTimeout(async () => {
            const projectsRes = await fetchProjectsClient({
              page: searchChanged ? 1 : page,
              search: debouncedSearch,
              teamIDs: [team.id],
            })

            const end = Date.now()
            const diff = end - start

            // the request was too fast, so we'll add a delay to make it appear as if it took longer
            if (diff < delay) {
              await new Promise((resolve) => setTimeout(resolve, delay - diff))
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
  }, [page, debouncedSearch, team.id, enableSearch])

  const cardArray = isLoading
    ? Array.from(Array(result?.docs?.length || result?.limit).keys())
    : result?.docs || []

  if (renderNewProjectBlock) {
    return (
      <NewProjectBlock
        cardLeader="New"
        heading={`Team '${team?.name}' has no projects yet`}
        largeHeading={false}
        teamSlug={team?.slug}
        templates={templates}
      />
    )
  }

  return (
    <Gutter>
      {error && <p className={classes.error}>{error}</p>}
      <div className={['grid', classes.controls].join(' ')}>
        <Text
          className={[
            team.isEnterprise === true ? 'cols-12 cols-m-4 cols-s-8' : 'cols-16',
            classes.search,
          ].join(' ')}
          fullWidth={false}
          initialValue={search}
          onChange={(value: string) => {
            setSearch(value)
            setEnableSearch(true)
          }}
          placeholder="Search projects"
        />
        {team.isEnterprise === true && (
          <div className="cols-4 cols-s-8">
            <Link
              className={classes.createButton}
              href={`/new${team?.slug ? `?team=${team?.slug}` : ''}`}
            >
              New Project
            </Link>
          </div>
        )}
      </div>

      <div className={classes.content}>
        {!isLoading && debouncedSearch && result?.totalDocs === 0 ? (
          <p className={classes.description}>
            {"Your search didn't return any results, please try again."}
          </p>
        ) : (
          <div className={['grid', classes.projects].join(' ')}>
            {cardArray?.map((project, index) => (
              <ProjectCard
                className={['cols-4'].join(' ')}
                isLoading={isLoading}
                key={project.name + index}
                project={project}
                showTeamName={false}
              />
            ))}
          </div>
        )}
      </div>
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
