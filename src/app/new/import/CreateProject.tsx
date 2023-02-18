import React, { useEffect } from 'react'
import { Cell, Grid } from '@faceless-ui/css-grid'
import { Select } from '@forms/fields/Select'
import { Text } from '@forms/fields/Text'
import Link from 'next/link'

import { Button } from '@components/Button'
import { Gutter } from '@components/Gutter'
import { useCreateDraftProject } from '../useCreateDraftProject'
import { Install } from './types'
import { useInstalls } from './useInstalls'
import { useRepos } from './useRepos'

import classes from './index.module.scss'

export const CreateProjectFromImport: React.FC = () => {
  const hasInitializedSelection = React.useRef(false)
  const [selectedInstall, setSelectedInstall] = React.useState<Install | undefined>(undefined)

  const {
    initiateProject,
    error: createError,
    isLoading,
  } = useCreateDraftProject({
    projectName: 'New project from import',
  })

  const { error: installsError, loading: installsLoading, installs } = useInstalls()

  const {
    error: reposError,
    loading: reposLoading,
    repos,
  } = useRepos({
    selectedInstall,
  })

  useEffect(() => {
    if (installs.length && !hasInitializedSelection.current) {
      hasInitializedSelection.current = true
      setSelectedInstall(installs[0])
    }
  }, [installs])

  return (
    <Gutter>
      {createError && <p>{createError}</p>}
      <Grid>
        <Cell cols={4} colsM={8} className={classes.sidebar}>
          <div>
            <p className={classes.label}>GitHub Scope</p>
            {installsError && <p>{installsError}</p>}
            {!installsLoading && (
              <Select
                initialValue={installs[0]?.account?.login}
                onChange={option => {
                  if (Array.isArray(option)) return
                  setSelectedInstall(
                    installs.find(install => install.account.login === option.value),
                  )
                }}
                options={[
                  {
                    label: 'None',
                    value: '',
                  },
                  ...(installs?.map(install => ({
                    label: install.account.login,
                    value: install.account.login,
                  })) || []),
                ]}
              />
            )}
          </div>
          <div>
            <p className={classes.label}>Search</p>
            <Text placeholder="Enter search term" />
          </div>
          <div>
            <p>
              {`Don't see your repository? `}
              <a
                href="https://docs.github.com/en/developers/apps/managing-github-apps/editing-a-github-apps-permissions"
                rel="noopener noreferrer"
                target="_blank"
              >
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
