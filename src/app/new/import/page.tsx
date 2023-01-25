'use client'

import { Button } from '@components/Button'
import { Gutter } from '@components/Gutter'
import { useAuth } from '@root/providers/Auth'
import React, { Fragment, useCallback, useEffect } from 'react'
import { getImplicitPreference } from '@root/providers/Theme/shared'
import { useHeaderTheme } from '@root/providers/HeaderTheme'
import Link from 'next/link'
import { ArrowIcon } from '@root/icons/ArrowIcon'
import { Breadcrumbs } from '@components/Breadcrumbs'
import classes from './index.module.scss'

const ProjectFromImport: React.FC = () => {
  const { user } = useAuth()
  const { setHeaderColor } = useHeaderTheme()
  const [hasAuthorizedGithub, setHasAuthorizedGithub] = React.useState(false)

  useEffect(() => {
    const implicitPreference = getImplicitPreference()
    setHeaderColor(implicitPreference ?? 'light')
  }, [])

  const authorizeGithub = useCallback(() => {
    // TODO: Implement GitHub authorization
    setHasAuthorizedGithub(true)
  }, [])

  if (!user) {
    return (
      <Gutter>
        <h1>You are not logged in.</h1>
        <Button label="Log in" href="/login" appearance="primary" />
      </Gutter>
    )
  }

  return (
    <Gutter>
      <div className={classes.header}>
        <Breadcrumbs
          items={[
            {
              label: 'Create New',
              url: '/new',
            },
            {
              label: 'New from import',
            },
          ]}
        />
        <h1>Import a codebase</h1>
      </div>
      {!hasAuthorizedGithub ? (
        <Fragment>
          <button className={classes.ghLink} onClick={authorizeGithub} type="button">
            <h6 className={classes.ghTitle}>Continue with GitHub</h6>
            <ArrowIcon size="large" />
          </button>
          <div className={classes.footer}>
            {`More Git providers are on their way. Don't see your Git provider available? `}
            <Link href="/contact">Send us a message</Link>
            {` and we'll see what we can do to expedite it.`}
          </div>
        </Fragment>
      ) : (
        <div>
          <div>
            <p>GitHub Organization</p>
          </div>
          <div>Search</div>
          <div>
            {`Don't see your organization? `}
            <Link href="/">Adjust your GitHub app permissions.</Link>
            {'.'}
          </div>
          <div>
            <p>Repositories</p>
            <p>Repo 1:</p>
            <Button label="Import" appearance="primary" />
          </div>
        </div>
      )}
    </Gutter>
  )
}

export default ProjectFromImport
