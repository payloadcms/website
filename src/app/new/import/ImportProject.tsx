import React, { Fragment, useCallback } from 'react'
import { Cell, Grid } from '@faceless-ui/css-grid'
import RadioGroup from '@forms/fields/RadioGroup'
import Form from '@forms/Form'
import FormProcessing from '@forms/FormProcessing'
import FormSubmissionError from '@forms/FormSubmissionError'
import Submit from '@forms/Submit'
import { useRouter } from 'next/navigation'

import { Button } from '@components/Button'
import { Gutter } from '@components/Gutter'
import { useInstallationButton } from '@components/InstallationButton'
import { useInstallationSelector } from '@components/InstallationSelector'
import { LineDraw } from '@components/LineDraw'
import { LoadingShimmer } from '@components/LoadingShimmer'
import { useTeamDrawer } from '@components/TeamDrawer'
import { useAuth } from '@root/providers/Auth'
import { useGetRepos } from '../../../utilities/use-get-repos'
import { useCreateDraftProject } from '../useCreateDraftProject'

import classes from './ImportProject.module.scss'

export const ImportProject: React.FC = () => {
  const { user } = useAuth()

  const router = useRouter()
  const [hoverIndex, setHoverIndex] = React.useState<number | undefined>(undefined)

  const [
    InstallationSelector,
    { value: selectedInstall, installs, loading: loadingInstalls, reload: reloadInstalls },
  ] = useInstallationSelector()

  const handleInstallationFromButton = useCallback(() => {
    reloadInstalls()
  }, [reloadInstalls])

  const [InstallationButton] = useInstallationButton({
    onInstallation: handleInstallationFromButton,
  })

  const createDraftProject = useCreateDraftProject({
    installID: selectedInstall?.id,
    onSubmit: ({ id: draftProjectID }) => {
      router.push(`/new/configure/${draftProjectID}`)
    },
  })

  const {
    loading: loadingRepos,
    results,
    page,
    setPage,
    perPage,
  } = useGetRepos({
    selectedInstall,
  })

  const [TeamDrawer, TeamDrawerToggler] = useTeamDrawer()
  const noTeams = !user?.teams || user?.teams.length === 0

  return (
    <Form
      onSubmit={({ unflattenedData }) => {
        const foundRepo = results.repos.find(repo => repo.name === unflattenedData?.repositoryName)
        if (foundRepo) {
          createDraftProject({
            repo: foundRepo,
          })
        }
      }}
    >
      <Gutter>
        {noTeams && (
          <div className={classes.errors}>
            <p>
              {`You must be a member of a team to create a project. `}
              <TeamDrawerToggler className={classes.createTeamLink}>
                Create a new team
              </TeamDrawerToggler>
              {'.'}
            </p>
          </div>
        )}
        <FormProcessing />
        <FormSubmissionError />
        <Grid>
          <Cell cols={4} colsM={8} className={classes.sidebarCell}>
            <div className={classes.sidebar}>
              <InstallationSelector description="Select the org or user to import from." />
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
            {((loadingRepos && installs?.length > 0) || loadingInstalls) && (
              <LoadingShimmer number={3} />
            )}
            {!loadingInstalls && !loadingRepos && results?.repos?.length > 0 && (
              <RadioGroup
                className={classes.repos}
                path="repositoryName"
                layout="vertical"
                hidden
                options={results?.repos?.map((repo, index) => {
                  const { name, description } = repo
                  const isHovered = hoverIndex === index

                  return {
                    value: name,
                    label: (
                      <div
                        key={repo.id}
                        className={classes.repo}
                        onMouseEnter={() => setHoverIndex(index)}
                        onMouseLeave={() => setHoverIndex(undefined)}
                      >
                        <div className={classes.repoContent}>
                          <h6 className={classes.repoName}>{name}</h6>
                          {description && <p className={classes.repoDescription}>{description}</p>}
                        </div>
                        <Submit label="Import" appearance="primary" />
                        <LineDraw align="bottom" active={isHovered} />
                      </div>
                    ),
                  }
                })}
              />
            )}
            {!loadingInstalls &&
              installs?.length > 0 &&
              !loadingRepos &&
              results?.repos?.length === 0 && (
                <div className={classes.noRepos}>
                  <h6>No repositories found</h6>
                  <p className={classes.appPermissions}>
                    {`No repositories were found in the account "${selectedInstall?.account?.login}". Create a new repository or `}
                    <a href={selectedInstall?.html_url} rel="noopener noreferrer" target="_blank">
                      adjust your GitHub app permissions
                    </a>
                    {'.'}
                  </p>
                </div>
              )}
            {!loadingInstalls && installs?.length === 0 && (
              <div className={classes.noRepos}>
                <h6>No installations found</h6>
                <p>
                  {`No installations were found under this profile. To see your repositories, you must first `}
                  <InstallationButton />
                  {'.'}
                </p>
              </div>
            )}
            {installs?.length > 0 && results.total_count / perPage > 1 && (
              <div className={classes.pagination}>
                <button
                  disabled={page - 1 < 1}
                  onClick={() => {
                    if (page - 1 < 1) return

                    setTimeout(() => {
                      window.scrollTo(0, 0)
                    }, 0)
                    setPage(page > 1 ? page - 1 : 1)
                  }}
                  className={classes.paginationButton}
                >
                  &#8249;
                </button>
                <span className={classes.paginationPage}>
                  {`Page ${page} of ${Math.ceil(results.total_count / perPage)}`}
                </span>
                <button
                  disabled={page + 1 > Math.ceil(results.total_count / perPage)}
                  onClick={() => {
                    if (page + 1 > Math.ceil(results.total_count / perPage)) return

                    setTimeout(() => {
                      window.scrollTo(0, 0)
                    }, 0)
                    setPage(page + 1)
                  }}
                  className={classes.paginationButton}
                >
                  &#8250;
                </button>
              </div>
            )}
          </Cell>
        </Grid>
      </Gutter>
      <TeamDrawer />
    </Form>
  )
}
