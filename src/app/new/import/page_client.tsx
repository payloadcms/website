'use client'

import React, { Fragment, useCallback, useReducer, useState } from 'react'
import { fetchInstalls, Install } from '@cloud/_api/fetchInstalls'
import { RepoResults } from '@cloud/_api/fetchRepos'
import { InstallationButton } from '@cloud/_components/InstallationButton'
import { InstallationSelector } from '@cloud/_components/InstallationSelector'
import { useTeamDrawer } from '@cloud/_components/TeamDrawer'
import { cloudSlug } from '@cloud/slug'
import { Cell, Grid } from '@faceless-ui/css-grid'
import RadioGroup from '@forms/fields/RadioGroup'
import Form from '@forms/Form'
import FormProcessing from '@forms/FormProcessing'
import FormSubmissionError from '@forms/FormSubmissionError'
import { useRouter, useSearchParams } from 'next/navigation'

import { Gutter } from '@components/Gutter'
import { Heading } from '@components/Heading'
import { Pagination } from '@components/Pagination'
import { Team } from '@root/payload-cloud-types'
import { createDraftProject } from '../createDraftProject'
import { RepoCard } from './RepoCard'
import { useGetRepos } from './useGetRepos'

import classes from './page.module.scss'

const perPage = 30

export const ImportProject: React.FC<{
  installs: Install[]
  repos?: RepoResults
  uuid: string
  user: any
}> = props => {
  const { installs: initialInstalls, repos: initialRepos, uuid, user } = props
  const searchParams = useSearchParams()
  const teamParam = searchParams?.get('team')
  const router = useRouter()
  const submitButtonRef = React.useRef<HTMLButtonElement | null>(null)
  const formRef = React.useRef<HTMLFormElement | null>(null)
  const [hoverIndex, setHoverIndex] = React.useState<number | undefined>(undefined)
  const [repoReloadTicker, reloadRepos] = useReducer(count => count + 1, 0)

  const [installs, setInstalls] = React.useState<Install[]>(initialInstalls || [])

  const [selectedInstall, setSelectedInstall] = React.useState<Install | undefined>(
    installs?.[0] || undefined,
  )

  const onInstall = useCallback(async () => {
    const freshInstalls = await fetchInstalls()
    setInstalls(freshInstalls)
    reloadRepos()
  }, [])

  const {
    loading: loadingRepos,
    results,
    page,
    setPage,
  } = useGetRepos({
    selectedInstall,
    repos: initialRepos?.repositories,
    reloadTicker: repoReloadTicker,
    perPage,
  })

  const matchedTeam = user?.teams?.find(
    ({ team }) => typeof team !== 'string' && team?.slug === teamParam,
  )?.team as Team //eslint-disable-line function-paren-newline

  const onDraftProjectCreate = useCallback(
    ({ slug: draftProjectSlug, team }) =>
      router.push(
        `/${cloudSlug}/${
          typeof team === 'string' ? team : team?.slug
        }/${draftProjectSlug}/configure`,
      ),
    [router],
  )

  const handleSubmit = useCallback(
    async ({ unflattenedData }) => {
      const foundRepo = results?.repositories?.find(
        repo => repo.name === unflattenedData.repositoryName,
      )

      if (!foundRepo) {
        throw new Error(`Please select a repository to import.`)
      }

      await createDraftProject({
        repo: foundRepo,
        teamID: matchedTeam?.id,
        installID: selectedInstall?.id,
        onSubmit: onDraftProjectCreate,
        user,
      })
    },
    [results, selectedInstall, matchedTeam, user, onDraftProjectCreate],
  )

  // automatically submit the form when a repo is selected
  const onRepoChange = useCallback(() => {
    const { current } = submitButtonRef
    if (current) {
      current.click()
    }
  }, [])

  const [TeamDrawer, TeamDrawerToggler] = useTeamDrawer()
  const noTeams = !user?.teams || user?.teams.length === 0

  // this will prevent layout shift, where we display loading card states on the screen in place of real data
  // to do this, we'll map an array of loading cards for the exactly number of cards that we expect to render
  const cardArray = loadingRepos
    ? Array.from(Array(results?.repositories?.length || perPage).keys())
    : results?.repositories || []

  return (
    <Form ref={formRef} onSubmit={handleSubmit}>
      <Gutter>
        <div className={classes.formState}>
          {noTeams && (
            <p className={classes.error}>
              {`You must be a member of a team to create a project. `}
              <TeamDrawerToggler className={classes.createTeamLink}>
                Create a new team
              </TeamDrawerToggler>
              {'.'}
            </p>
          )}
          <FormProcessing message="Creating project, one moment..." />
          <FormSubmissionError />
        </div>
        <Grid>
          <Cell cols={4} colsM={8} className={classes.sidebarCell}>
            <div className={classes.sidebar}>
              <InstallationSelector
                description="Select the org or user to import from."
                hideLabel
                installs={installs}
                onChange={setSelectedInstall}
                onInstall={onInstall}
                uuid={uuid}
              />
              <p className={classes.appPermissions}>
                {`Don't see your repository? `}
                <a href={selectedInstall?.html_url} rel="noopener noreferrer" target="_blank">
                  Adjust your GitHub app permissions
                </a>
                {'.'}
              </p>
            </div>
          </Cell>
          <Cell cols={8} colsM={8}>
            {installs?.length === 0 && (
              <div className={classes.noRepos}>
                <Heading marginTop={false} element="h6">
                  No installations found
                </Heading>
                <p>
                  {`No installations were found under this profile. To see your repositories, you must first `}
                  <InstallationButton
                    label="install the GitHub Payload app"
                    onInstall={onInstall}
                    uuid={uuid}
                  />
                  {'.'}
                </p>
              </div>
            )}
            {installs?.length > 0 && (
              <Fragment>
                {cardArray?.length > 0 ? (
                  <RadioGroup
                    className={[classes.repos, loadingRepos && classes.loading]
                      .filter(Boolean)
                      .join(' ')}
                    initialValue=""
                    path="repositoryName"
                    layout="vertical"
                    hidden
                    required
                    onChange={onRepoChange}
                    options={cardArray?.map((repo, index) => {
                      const isHovered = hoverIndex === index

                      return {
                        value: repo?.name,
                        label: (
                          <RepoCard
                            key={index}
                            repo={repo}
                            isHovered={isHovered}
                            isLoading={loadingRepos}
                            onMouseEnter={() => setHoverIndex(index)}
                            onMouseLeave={() => setHoverIndex(undefined)}
                            onClick={async repo => {
                              try {
                                await createDraftProject({
                                  repo,
                                  teamID: matchedTeam?.id,
                                  installID: selectedInstall?.id,
                                  onSubmit: onDraftProjectCreate,
                                  user,
                                })
                              } catch (error) {
                                window.scrollTo(0, 0)
                                console.error(error) // eslint-disable-line no-console
                              }
                            }}
                          />
                        ),
                      }
                    })}
                  />
                ) : (
                  <div className={classes.noRepos}>
                    <Heading marginTop={false} element="h6">
                      No repositories found
                    </Heading>
                    <p className={classes.appPermissions}>
                      {`No repositories were found in the account "${selectedInstall?.account?.login}". Create a new repository or `}
                      <a href={selectedInstall?.html_url} rel="noopener noreferrer" target="_blank">
                        adjust your GitHub app permissions
                      </a>
                      {'.'}
                    </p>
                  </div>
                )}
              </Fragment>
            )}

            {installs?.length > 0 && results?.total_count / perPage > 1 && (
              <Pagination
                page={page}
                setPage={setPage}
                totalPages={Math.ceil(results?.total_count / perPage)}
                className={classes.pagination}
              />
            )}
          </Cell>
        </Grid>
      </Gutter>
      <TeamDrawer />
      <button
        ref={submitButtonRef}
        // this button is hidden and programmatically clicked when a repo is selected
        // see the `onChange` handler on the `RadioGroup` above
        type="submit"
        className={classes.submit}
      />
    </Form>
  )
}
