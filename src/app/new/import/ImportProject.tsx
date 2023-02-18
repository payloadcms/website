import React from 'react'
import { Cell, Grid } from '@faceless-ui/css-grid'
import Link from 'next/link'

import { Button } from '@components/Button'
import { Gutter } from '@components/Gutter'
import { ScopeSelector } from '@components/ScopeSelector'
import { Install } from '@root/utilities/use-get-installs'
import { useCreateDraftProject } from '../../../utilities/use-create-draft-project'
import { useGetRepos } from '../../../utilities/use-get-repos'

import classes from './index.module.scss'

export const ImportProject: React.FC = () => {
  const [selectedInstall, setSelectedInstall] = React.useState<Install | undefined>(undefined)

  const {
    initiateProject,
    error: createError,
    isLoading,
  } = useCreateDraftProject({
    projectName: 'New project from import',
  })

  const {
    error: reposError,
    loading: reposLoading,
    repos,
  } = useGetRepos({
    selectedInstall,
  })

  return (
    <Gutter>
      {createError && <p>{createError}</p>}
      <Grid>
        <Cell cols={4} colsM={8} className={classes.sidebar}>
          <div>
            <p className={classes.label}>GitHub Scope</p>
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
          {!reposLoading && repos?.length > 0 ? (
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
                        if (!isLoading) initiateProject(repo.name)
                      }}
                      disabled={isLoading}
                    />
                  </div>
                )
              })}
            </div>
          ) : (
            <div className={classes.noRepos}>
              <p>
                {`You don't have any repositories in your organization. `}
                <Link href="/new/clone">Create a new one</Link>
                {` from one of our templates.`}
              </p>
            </div>
          )}
        </Cell>
      </Grid>
    </Gutter>
  )
}
