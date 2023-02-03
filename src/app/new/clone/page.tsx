'use client'

import React, { Fragment, useCallback } from 'react'
import { Cell, Grid } from '@faceless-ui/css-grid'
import { Checkbox } from '@forms/fields/Checkbox'
import { Select } from '@forms/fields/Select'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'

import { Breadcrumbs } from '@components/Breadcrumbs'
import { Button } from '@components/Button'
import { Gutter } from '@components/Gutter'
import { Heading } from '@components/Heading'
import { GitHubIcon } from '@root/graphics/GitHub'
import { ArrowIcon } from '@root/icons/ArrowIcon'
import templatesJSON from '../templates/templates.json'

import classes from './index.module.scss'

const ProjectFromTemplate: React.FC = () => {
  const params = useSearchParams()
  const [hasAuthorizedGithub, setHasAuthorizedGithub] = React.useState(false)

  const [initialTemplate, setInitialTemplate] = React.useState(() => {
    return params.get('template') || 'blank'
  })

  const authorizeGithub = useCallback(() => {
    // TODO: Implement GitHub authorization
    setHasAuthorizedGithub(true)
  }, [])

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
                initialValue={initialTemplate}
                onChange={incomingOption => {
                  if (Array.isArray(incomingOption)) return
                  setInitialTemplate(incomingOption?.value)
                }}
                options={templatesJSON.map(template => ({
                  label: template.label,
                  value: template.name,
                }))}
              />
            </div>
            <div>
              <p>
                {templatesJSON.find(template => template.name === initialTemplate)?.description}
              </p>
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
            </Grid>
            <div>
              {`Don't see your organization? `}
              <Link href="/">Adjust your GitHub app permissions</Link>
              {'.'}
            </div>
            <div className={classes.createPrivate}>
              <Checkbox label="Create private Git repository" />
            </div>
            <Button label="configure project" appearance="primary" icon="arrow" />
          </Cell>
        </Grid>
      )}
    </Gutter>
  )
}

export default ProjectFromTemplate
