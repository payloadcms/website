'use client'

import React, { Fragment, useCallback, useEffect, useRef } from 'react'
import { Cell, Grid } from '@faceless-ui/css-grid'
import { Checkbox } from '@forms/fields/Checkbox'
import { Select } from '@forms/fields/Select'
import { Text } from '@forms/fields/Text'
import Link from 'next/link'
import { redirect, useSearchParams } from 'next/navigation'

import { Breadcrumbs } from '@components/Breadcrumbs'
import { Button } from '@components/Button'
import { Gutter } from '@components/Gutter'
import { Heading } from '@components/Heading'
import { GitHubIcon } from '@root/graphics/GitHub'
import { ArrowIcon } from '@root/icons/ArrowIcon'
import { useAuth } from '@root/providers/Auth'
import { useGlobals } from '@root/providers/Globals'

import classes from './index.module.scss'

const ProjectFromTemplate: React.FC = () => {
  const params = useSearchParams()
  const { templates } = useGlobals()

  const { user } = useAuth()
  const [error, setError] = React.useState('')
  const hasRequestedGithub = useRef(false)
  const [hasAuthorizedGithub, setHasAuthorizedGithub] = React.useState(false)
  const [name, setName] = React.useState('my-project')

  const [template, setTemplate] = React.useState(() => {
    return params.get('template') || 'blank'
  })

  useEffect(() => {
    // todo: push to query params
  }, [template])

  useEffect(() => {
    const code = params.get('code')

    if (user && code && !hasRequestedGithub.current) {
      hasRequestedGithub.current = true

      const exchangeCode = async () => {
        try {
          const res = await fetch(`${process.env.NEXT_PUBLIC_CLOUD_CMS_URL}/api/gh?code=${code}`, {
            method: 'GET',
            credentials: 'include',
          })

          const body = await res.json()

          if (res.ok) {
            setHasAuthorizedGithub(true)

            // do more async stuff
          } else {
            setError(`Unable to authorize GitHub: ${body.error}`)
          }
        } catch (err) {
          console.error(err)
          setError(err.message)
        }
      }

      exchangeCode()
    }
  }, [user, params])

  const handleSubmit = useCallback(async () => {
    try {
      const projectReq = await fetch(`${process.env.NEXT_PUBLIC_CLOUD_CMS_URL}/api/projects`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          owner: 'TEAM_ID', // TODO get this from the URL
          template,
        }),
      })

      const projectRes = await projectReq.json()

      if (projectReq.ok) {
        redirect(`/projects/${projectRes.id}`)
      } else {
        setError(projectRes.error)
      }
    } catch (err) {
      console.error(err)
      setError(err.message)
    }
  }, [template])

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
              label: 'Template',
            },
          ]}
        />
        <h1>Create new from template</h1>
      </div>
      {error && <p>{error}</p>}
      {!hasAuthorizedGithub ? (
        <Fragment>
          <a
            className={classes.ghLink}
            href={`https://github.com/login/oauth/authorize?client_id=${
              process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID
            }&redirect_uri=${encodeURIComponent(
              process.env.NEXT_PUBLIC_GITHUB_REDIRECT_URI,
            )}&state=${encodeURIComponent('/new/clone')}`}
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
            <div>
              <p className={classes.label}>Selected template</p>
              <Select
                isMulti={false}
                initialValue={template}
                onChange={incomingOption => {
                  if (Array.isArray(incomingOption)) return
                  setTemplate(incomingOption?.value)
                }}
                options={templates.map(temp => ({
                  label: temp.name,
                  value: temp.id,
                }))}
              />
            </div>
            <div>
              <p>{templates.find(temp => temp.name === template)?.description}</p>
            </div>
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
                <Text initialValue={name} onChange={setName} />
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
              label="Configure project"
              appearance="primary"
              icon="arrow"
              onClick={handleSubmit}
            />
          </Cell>
        </Grid>
      )}
    </Gutter>
  )
}

export default ProjectFromTemplate
