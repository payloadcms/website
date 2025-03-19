'use client'
import { cloudSlug } from '@cloud/slug'
import { Select } from '@forms/fields/Select'
import Form from '@forms/Form'
import { PRODUCTION_ENVIRONMENT_SLUG } from '@root/constants'
import { generateRoutePath } from '@root/utilities/generate-route-path'
import { useParams, usePathname, useRouter } from 'next/navigation'
import React from 'react'

import classes from './index.module.scss'
export function ProjectHeader({ environmentOptions, title }) {
  const {
    'environment-slug': environmentSlug = PRODUCTION_ENVIRONMENT_SLUG,
    'project-slug': projectSlug,
    'team-slug': teamSlug,
  }: { [key: string]: string } = useParams()
  const pathname = usePathname()
  const router = useRouter()
  const baseProjectURL = `/${cloudSlug}/${teamSlug}/${projectSlug}`

  const handleEnvironmentChange = React.useCallback(
    (environmentToSet: string) => {
      if (environmentToSet !== environmentSlug) {
        const routeSegment = pathname
          .replace(baseProjectURL, '')
          .replace(`/env/${environmentSlug}`, '')
        router.push(
          generateRoutePath({
            environmentSlug:
              environmentToSet !== PRODUCTION_ENVIRONMENT_SLUG ? environmentToSet : undefined,
            projectSlug,
            suffix: routeSegment,
            teamSlug,
          }),
        )
      }
    },
    [baseProjectURL, environmentSlug, pathname, projectSlug, router, teamSlug],
  )

  return (
    <div className={classes.projectHeader}>
      <h3>{title}</h3>
      {Array.isArray(environmentOptions) && environmentOptions.length > 1 && (
        <div className={classes.projectHeader__environmentSelector}>
          <Form
            initialState={{
              environment: {
                errorMessage: '',
                initialValue: environmentSlug,
                valid: true,
                value: environmentSlug,
              },
            }}
          >
            <Select
              className={classes.projectHeader__environmentSelector__select}
              initialValue={environmentSlug}
              isSearchable={false}
              label="Environment:"
              name="environment"
              onChange={handleEnvironmentChange}
              options={environmentOptions}
              path="environment"
              value={environmentSlug}
            />
          </Form>
        </div>
      )}
    </div>
  )
}
