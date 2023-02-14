'use client'

import React, { Fragment } from 'react'
import { Cell, Grid } from '@faceless-ui/css-grid'
import { Checkbox } from '@forms/fields/Checkbox'
import { Select } from '@forms/fields/Select'
import { Text } from '@forms/fields/Text'
import { Params } from 'next/dist/shared/lib/router/utils/route-matcher'
import Link from 'next/link'

import { Breadcrumbs } from '@components/Breadcrumbs'
import { Button } from '@components/Button'
import { Gutter } from '@components/Gutter'
import { Heading } from '@components/Heading'
import { GitHubIcon } from '@root/graphics/GitHub'
import { ArrowIcon } from '@root/icons/ArrowIcon'
import { useGlobals } from '@root/providers/Globals'
import { useCreateDraftProject } from '../../useCreateDraftProject'
import { useExchangeCode } from '../../useExchangeCode'

import classes from './index.module.scss'

const ProjectFromTemplate: React.FC<{
  params: Params
}> = ({ params: { template: templateParam } }) => {
  const { templates } = useGlobals()
  const [name, setName] = React.useState('my-project')
  const matchedTemplate = templates.find(t => t.slug === templateParam)

  const { error: exchangeError, hasAuthorizedGithub } = useExchangeCode()

  const { initiateProject, error, isLoading } = useCreateDraftProject({
    projectName: `New Project from ${matchedTemplate?.name} template`,
    templateID: matchedTemplate.slug,
  })

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
              label: 'Clone',
              url: '/new/clone',
            },
            {
              label: matchedTemplate?.name,
            },
          ]}
        />
        <h1>Create new from template</h1>
      </div>
      {error && <p>{error}</p>}
      {exchangeError && <p>{exchangeError}</p>}
      {!hasAuthorizedGithub ? (
        <Fragment>
          <a
            className={classes.ghLink}
            href={`https://github.com/login/oauth/authorize?client_id=${
              process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID
            }&redirect_uri=${encodeURIComponent(
              process.env.NEXT_PUBLIC_GITHUB_REDIRECT_URI,
            )}&state=${encodeURIComponent(`/new/clone/${templateParam}`)}`}
            type="button"
          >
            <GitHubIcon className={classes.ghIcon} />
            <Heading element="h2" as="h6" margin={false} className={classes.ghTitle}>
              Continue with GitHub
            </Heading>
            <ArrowIcon size="large" />
          </a>
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
        <Grid>
          <Cell cols={4} colsM={8} className={classes.sidebar}>
            <p className={classes.label}>Selected template</p>
            <p>{matchedTemplate?.name}</p>
            <p>{matchedTemplate?.description}</p>
          </Cell>
          <Cell cols={8} colsM={8}>
            <Grid className={classes.projectInfo}>
              <Cell cols={4}>
                <p className={classes.label}>Git Scope</p>
                <Select
                  initialValue=""
                  options={[
                    {
                      label: 'None',
                      value: '',
                    },
                  ]}
                />
              </Cell>
              <Cell cols={4}>
                <p className={classes.label}>Repository Name</p>
                <Text initialValue={name} onChange={setName} required />
              </Cell>
            </Grid>
            <div>
              {`Don't see your organization? `}
              <a
                href="https://docs.github.com/en/developers/apps/managing-github-apps/editing-a-github-apps-permissions"
                rel="noopener noreferrer"
                target="_blank"
              >
                Adjust your GitHub app permissions
              </a>
              {'.'}
            </div>
            <div className={classes.createPrivate}>
              <Checkbox label="Create private Git repository" />
            </div>
            <Button
              label={isLoading ? 'Creating...' : 'Create Project'}
              appearance="primary"
              icon="arrow"
              onClick={initiateProject}
              disabled={isLoading}
            />
          </Cell>
        </Grid>
      )}
    </Gutter>
  )
}

export default ProjectFromTemplate
