import React from 'react'
import { Cell, Grid } from '@faceless-ui/css-grid'
import Label from '@forms/Label'
import { useRouter } from 'next/navigation'

import { Button } from '@components/Button'
import { Gutter } from '@components/Gutter'
import { LoadingShimmer } from '@components/LoadingShimmer'
import { ScopeSelector } from '@components/ScopeSelector'
import { Install } from '@root/utilities/use-get-installs'
import { useCreateDraftProject } from '../../../../utilities/use-create-draft-project'
import { useGetRepos } from '../../../../utilities/use-get-repos'

import classes from './index.module.scss'

export const ImportProject: React.FC = () => {
  const [selectedInstall, setSelectedInstall] = React.useState<Install | undefined>(undefined)
  const router = useRouter()

  const {
    initiateProject,
    error: createError,
    isSubmitting,
  } = useCreateDraftProject({
    projectName: 'New project from import',
    installID: selectedInstall?.id,
    onSubmit: ({ id: draftProjectID }) => {
      router.push(`/new/import/configure/${draftProjectID}`)
    },
  })

  const {
    error: reposError,
    loading: loadingRepos,
    repos,
  } = useGetRepos({
    selectedInstall,
  })

  return (
    <Gutter>
      {createError && <p className={classes.error}>{createError}</p>}
      <Grid>
        <Cell cols={4} colsM={8} className={classes.sidebar}>
          <div>
            <Label label="GitHub Scope" required htmlFor="" />
            <ScopeSelector onChange={setSelectedInstall} />
          </div>
          {/* <div>
            <p className={classes.label}>Search</p>
            <Text placeholder="Enter search term" />
          </div> */}
          <div>
            <p>
              {`Don't see your repository? `}
              <a href={selectedInstall?.html_url} rel="noopener noreferrer" target="_blank">
                Adjust your GitHub app permissions
              </a>
              {'.'}
            </p>
          </div>
        </Cell>
        <Cell cols={8} colsM={8}>
          {reposError && <p>{reposError}</p>}
          {loadingRepos && <LoadingShimmer number={3} />}
          {!loadingRepos && !isSubmitting && repos?.length > 0 && (
            <div className={classes.repos}>
              {repos?.map(repo => {
                const { name } = repo
                return (
                  <div key={repo.id} className={classes.repo}>
                    <h6 className={classes.repoName}>{name}</h6>
                    <Button
                      label="Import"
                      appearance="primary"
                      size="small"
                      onClick={() => {
                        if (!isSubmitting) initiateProject(repo.name)
                      }}
                      disabled={isSubmitting}
                    />
                  </div>
                )
              })}
            </div>
          )}
          {!loadingRepos && repos?.length === 0 && (
            <div className={classes.noRepos}>
              <h6>No repositories found</h6>
              <p>
                {`This can happen when Payload doesn't have access to the repositories in an account. Configure the Payload app on GitHub, and give it access to the repository you want to link.`}
              </p>
              <Button
                label="Configure Payload on GitHub"
                className={classes.addAccountButton}
                href={`https://github.com/apps/payload-cms/installations/new?client_id=${
                  process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID
                }&redirect_uri=${encodeURIComponent(
                  process.env.NEXT_PUBLIC_GITHUB_REDIRECT_URI,
                )}&state=${encodeURIComponent(`/new/import`)}`}
                appearance="primary"
                el="a"
              />
            </div>
          )}
        </Cell>
      </Grid>
    </Gutter>
  )
}
