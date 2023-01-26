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
import { Checkbox } from '@forms/fields/Checkbox'
import { Heading } from '@components/Heading'
import classes from './index.module.scss'

const ProjectFromTemplate: React.FC = () => {
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
              label: 'Template',
            },
          ]}
        />
        <h1>Create new from template</h1>
      </div>
      {!hasAuthorizedGithub ? (
        <Fragment>
          <button className={classes.ghLink} onClick={authorizeGithub} type="button">
            <Heading element="h2" as="h6" margin={false} className={classes.ghTitle}>
              Continue with GitHub
            </Heading>
            <ArrowIcon size="large" />
          </button>
          <div className={classes.footer}>
            <p>
              {`Have an existing project? `}
              <Link href="/new/import">Import that</Link>
              {` instead.`}
            </p>
            <p>
              {`Don't see your Git provider available? More Git providers are on their way. `}
              <Link href="/contact">Send us a message</Link>
              {` and we'll see what we can do to expedite it.`}
            </p>
          </div>
        </Fragment>
      ) : (
        <div>
          <div>
            <p>
              Selected template: <strong>Blank CMS</strong>
            </p>
            <p>A full e-commerce backend, integrated with Stripe and ready to sell.</p>
          </div>
          <div>Git Scope</div>
          <div>Repository Name</div>
          <div>
            {`Don't see your organization? `}
            <Link href="/">Adjust your GitHub app permissions.</Link>
            {'.'}
          </div>
          <div className={classes.createPrivate}>
            <Checkbox label="Create private Git repository" />
          </div>
          <Button label="configure project" appearance="primary" />
        </div>
      )}
    </Gutter>
  )
}

export default ProjectFromTemplate
