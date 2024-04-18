'use client'

import React, { useEffect } from 'react'
import { fetchProjectsClient, ProjectsRes } from '@cloud/_api/fetchProjects'
import { TeamWithCustomer } from '@cloud/_api/fetchTeam'
import { ProjectCard } from '@cloud/_components/ProjectCard'
import { Text } from '@forms/fields/Text'
import Link from 'next/link'

import { Gutter } from '@components/Gutter'
import { Pagination } from '@components/Pagination'
import { NewProjectBlock } from '@root/app/_components/NewProject'
import { Template } from '@root/payload-cloud-types'
import useDebounce from '@root/utilities/use-debounce'

import classes from './page.module.scss'

const delay = 500
const debounce = 350

export const TeamPage: React.FC<{
  team: TeamWithCustomer
  initialState: ProjectsRes
  templates?: Template[]
}> = ({ team, initialState, templates }) => {
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
    if (requestRef.current) clearTimeout(requestRef.current)

    // only perform searches after the user has engaged with the search field or pagination
    // the only stable way of doing this is to explicitly set the `enableSearch` flag on these event handlers
    if (enableSearch) {
      setIsLoading(true)

      // if the search changed, reset the page back to 1
      const searchChanged = searchRef.current !== debouncedSearch
      if (searchChanged) searchRef.current = debouncedSearch

      const doFetch = async () => {
        // give the illusion of loading, so that fast network connections appear to flash
        // this gives the user a visual indicator that something is happening
        const start = Date.now()

        try {
          requestRef.current = setTimeout(async () => {
            const projectsRes = await fetchProjectsClient({
              teamIDs: [team.id],
              page: searchChanged ? 1 : page,
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
  }, [page, debouncedSearch, team.id, enableSearch])

  const cardArray = isLoading
    ? Array.from(Array(result?.docs?.length || result?.limit).keys())
    : result?.docs || []

  if (renderNewProjectBlock) {
    return (
      <NewProjectBlock
        heading={`Team '${team?.name}' has no projects yet`}
        cardLeader="New"
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
          placeholder="Search projects"
          initialValue={search}
          onChange={(value: string) => {
            setSearch(value)
            setEnableSearch(true)
          }}
          className={['cols-14', classes.search].join(' ')}
          fullWidth={false}
        />
        <div className="cols-2">
          <Link
            className={classes.createButton}
            href={`/new${team?.slug ? `?team=${team?.slug}` : ''}`}
          >
            New Project
          </Link>
        </div>
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
                project={project}
                className={['cols-4'].join(' ')}
                isLoading={isLoading}
                showTeamName={false}
                key={project.name + index}
              />
            ))}
          </div>
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
