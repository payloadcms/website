import React from 'react'
import { Cell, Grid } from '@faceless-ui/css-grid'
import { Select } from '@forms/fields/Select'
import { Text } from '@forms/fields/Text'
import Link from 'next/link'

import { Button } from '@components/Button'
import { Gutter } from '@components/Gutter'
import { useCreateDraftProject } from '../useCreateDraftProject'
import { Repo } from './types'

import classes from './index.module.scss'

export const CreateProjectFromImport: React.FC<{
  initialRepos: Repo[]
}> = props => {
  const { initialRepos: repos } = props
  const {
    initiateProject,
    error: createError,
    isLoading,
  } = useCreateDraftProject({
    projectName: 'New project from import',
  })

  return (
    <Gutter>
      {createError && <p>{createError}</p>}
      <Grid>
        <Cell cols={4} colsM={8} className={classes.sidebar}>
          <div>
            <p className={classes.label}>GitHub Organization</p>
            <Select
              initialValue=""
              options={[
                {
                  label: 'None',
                  value: '',
                },
              ]}
            />
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
          {repos?.length > 0 ? (
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
