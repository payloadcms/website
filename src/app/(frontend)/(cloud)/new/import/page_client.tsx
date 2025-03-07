'use client'

import type { Install } from '@cloud/_api/fetchInstalls'
import type { RepoResults } from '@cloud/_api/fetchRepos'
import type { Team } from '@root/payload-cloud-types'

import { fetchInstalls } from '@cloud/_api/fetchInstalls'
import { InstallationButton } from '@cloud/_components/InstallationButton/index'
import { InstallationSelector } from '@cloud/_components/InstallationSelector/index'
import { useTeamDrawer } from '@cloud/_components/TeamDrawer/index'
import { cloudSlug } from '@cloud/slug'
import { Gutter } from '@components/Gutter/index'
import { Pagination } from '@components/Pagination/index'
import RadioGroup from '@forms/fields/RadioGroup/index'
import Form from '@forms/Form/index'
import FormProcessing from '@forms/FormProcessing/index'
import FormSubmissionError from '@forms/FormSubmissionError/index'
import { useRouter, useSearchParams } from 'next/navigation'
import React, { Fragment, useCallback, useReducer } from 'react'

import { createDraftProject } from '../createDraftProject'
import classes from './page.module.scss'
import { RepoCard } from './RepoCard/index'
import { useGetRepos } from './useGetRepos'

const perPage = 30

export const ImportProject: React.FC<{
  installs: Install[]
  repos?: RepoResults
  user: any
  uuid: string
}> = (props) => {
  const { installs: initialInstalls, repos: initialRepos, user, uuid } = props
  const searchParams = useSearchParams()
  const teamParam = searchParams?.get('team')
  const router = useRouter()
  const submitButtonRef = React.useRef<HTMLButtonElement | null>(null)
  const formRef = React.useRef<HTMLFormElement | null>(null)
  const [hoverIndex, setHoverIndex] = React.useState<number | undefined>(undefined)
  const [repoReloadTicker, reloadRepos] = useReducer((count) => count + 1, 0)

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
    page,
    results,
    setPage,
  } = useGetRepos({
    perPage,
    reloadTicker: repoReloadTicker,
    repos: initialRepos?.repositories,
    selectedInstall,
  })

  const matchedTeam = user?.teams?.find(
    ({ team }) => typeof team !== 'string' && team?.slug === teamParam,
  )?.team as Team

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
        (repo) => repo.name === unflattenedData.repositoryName,
      )

      if (!foundRepo) {
        throw new Error(`Please select a repository to import.`)
      }

      await createDraftProject({
        installID: selectedInstall?.id,
        onSubmit: onDraftProjectCreate,
        repo: foundRepo,
        teamID: matchedTeam?.id,
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
    <Form onSubmit={handleSubmit} ref={formRef}>
      <Gutter>
        <div className={[classes.formState, 'cols-16'].join(' ')}>
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

        <div className={[classes.section, 'cols-16'].join(' ')}>
          <div className={classes.orgLabel}>
            <p>Select the org or user to import from.</p>
            <p className={classes.appPermissions}>
              {`Don't see your repository? `}
              <a href={selectedInstall?.html_url} rel="noopener noreferrer" target="_blank">
                Adjust your GitHub app permissions
              </a>
              {'.'}
            </p>
          </div>
          <InstallationSelector
            hideLabel
            installs={installs}
            onChange={setSelectedInstall}
            onInstall={onInstall}
            uuid={uuid}
          />
        </div>
        <h4>Repositories</h4>
        <div className={[classes.section, 'cols-16'].join(' ')}>
          {installs?.length === 0 && (
            <div className={classes.noRepos}>
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
                  hidden
                  initialValue=""
                  layout="vertical"
                  onChange={onRepoChange}
                  options={cardArray?.map((repo, index) => {
                    const isHovered = hoverIndex === index

                    return {
                      label: (
                        <RepoCard
                          isHovered={isHovered}
                          isLoading={loadingRepos}
                          key={index}
                          onClick={async (repo) => {
                            try {
                              await createDraftProject({
                                installID: selectedInstall?.id,
                                onSubmit: onDraftProjectCreate,
                                repo,
                                teamID: matchedTeam?.id,
                                user,
                              })
                            } catch (error) {
                              window.scrollTo(0, 0)
                              console.error(error) // eslint-disable-line no-console
                            }
                          }}
                          onMouseEnter={() => setHoverIndex(index)}
                          onMouseLeave={() => setHoverIndex(undefined)}
                          repo={repo}
                        />
                      ),
                      value: repo?.name,
                    }
                  })}
                  path="repositoryName"
                  required
                />
              ) : (
                <div className={classes.noRepos}>
                  <p className={classes.appPermissions}>
                    {`No repositories were found in the account "${
                      (selectedInstall?.account as { login: string })?.login
                    }". Create a new repository or `}
                    <a href={selectedInstall?.html_url} rel="noopener noreferrer" target="_blank">
                      adjust your GitHub app permissions
                    </a>
                    {'.'}
                  </p>
                </div>
              )}
            </Fragment>
          )}
        </div>
        {installs?.length > 0 && initialRepos && initialRepos?.total_count > perPage && (
          <Pagination
            className={classes.pagination}
            page={page}
            setPage={setPage}
            totalPages={Math.ceil(initialRepos?.total_count / perPage)}
          />
        )}
      </Gutter>
      <TeamDrawer />
      <button
        className={classes.submit}
        ref={submitButtonRef}
        // this button is hidden and programmatically clicked when a repo is selected
        // see the `onChange` handler on the `RadioGroup` above
        type="submit"
      />
    </Form>
  )
}
