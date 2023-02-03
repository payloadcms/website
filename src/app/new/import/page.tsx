'use client'

import React, { Fragment, useCallback, useEffect } from 'react'
import { Cell, Grid } from '@faceless-ui/css-grid'
import { Select } from '@forms/fields/Select'
import { Text } from '@forms/fields/Text'
import Link from 'next/link'

import { Breadcrumbs } from '@components/Breadcrumbs'
import { Button } from '@components/Button'
import { Gutter } from '@components/Gutter'
import { Heading } from '@components/Heading'
import { GitHubIcon } from '@root/graphics/GitHub'
import { ArrowIcon } from '@root/icons/ArrowIcon'
import { useAuth } from '@root/providers/Auth'
import { useHeaderTheme } from '@root/providers/HeaderTheme'
import { getImplicitPreference } from '@root/providers/Theme/shared'

import classes from './index.module.scss'

const ProjectFromImport: React.FC = () => {
  const { user } = useAuth()
  const { setHeaderColor } = useHeaderTheme()
  const [hasAuthorizedGithub, setHasAuthorizedGithub] = React.useState(false)
  const [repos, setRepos] = React.useState([])

  useEffect(() => {
    const implicitPreference = getImplicitPreference()
    setHeaderColor(implicitPreference ?? 'light')
  }, [])

  const authorizeGithub = useCallback(() => {
    const makeReq = async () => {
      // todo: make this a real request
      setHasAuthorizedGithub(true)
    }

    makeReq()
  }, [])

  useEffect(() => {
    const getRepos = async () => {
      const res = await fetch(`${process.env.NEXT_PUBLIC_CLOUD_CMS_URL}/api/users/repositories`, {
        method: 'GET',
        credentials: 'include',
      })

      if (res.ok) {
        const body = await res.json()
        setRepos(body)
      }
    }

    if (hasAuthorizedGithub && user) getRepos()
  }, [hasAuthorizedGithub, user])

  return (
    <Gutter>
      <div className={classes.header}>
        <Breadcrumbs
          items={[
            {
              label: 'New',
              url: '/new',
            },
            {
              label: 'Import',
            },
          ]}
        />
        <h1>Import a codebase</h1>
      </div>
      {!hasAuthorizedGithub ? (
        <Fragment>
          <button className={classes.ghLink} onClick={authorizeGithub} type="button">
            <GitHubIcon className={classes.ghIcon} />
            <Heading element="h2" as="h6" margin={false} className={classes.ghTitle}>
              Continue with GitHub
            </Heading>
            <ArrowIcon size="large" />
          </button>
          <div className={classes.footer}>
            <p>
              {`Don't have a project yet? `}
              <Link href="/new/clone">Create a new one</Link>
              {` from one of our templates.`}
            </p>
            <p>
              {`Don't see your Git provider available? More Git providers are on their way. `}
              <Link href="/contact">Send us a message</Link>
              {` and we'll see what we can do to expedite it.`}
            </p>
          </div>
        </Fragment>
      ) : (
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
                <Link href="/">Adjust your GitHub app permissions</Link>
                {'.'}
              </p>
            </div>
          </Cell>
          <Cell cols={8} colsM={8}>
            {repos.length > 0 ? (
              <div className={classes.repos}>
                {repos?.map(repo => {
                  const { name } = repo
                  return (
                    <div key={repo.id} className={classes.repo}>
                      <h6 className={classes.repoName}>{name}</h6>
                      <Button label="Import" appearance="primary" size="small" />
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
      )}
    </Gutter>
  )
}

export default ProjectFromImport
