'use client'

import * as React from 'react'
import { AddArrayRow, ArrayRow } from '@forms/fields/Array'
import { ArrayProvider, useArray } from '@forms/fields/Array/context'
import { Text } from '@forms/fields/Text'
import Form from '@forms/Form'
import Submit from '@forms/Submit'
import { OnSubmit } from '@forms/types'

import { useRouteData } from '@root/app/cloud/context'
import { validateKey, validateValue } from '../validations'

import classes from './index.module.scss'

export const EnvManagement: React.FC = () => {
  const { uuids, clearRows } = useArray()
  const { project, reloadProject } = useRouteData()
  const projectID = project.id

  const existingEnvKeys = (project.environmentVariables || []).map(({ key }) => key || '')

  const handleSubmit: OnSubmit = React.useCallback(
    async ({ unflattenedData }) => {
      if (unflattenedData?.newEnvs?.length > 0) {
        const sanitizedEnvs = unflattenedData.newEnvs.reduce((acc, env) => {
          const envKey = env.key?.trim()
          if (envKey && !acc.includes(envKey)) {
            acc.push({
              key: envKey,
              value: env.value,
            })
          }

          return acc
        }, [])

        try {
          const req = await fetch(
            `${process.env.NEXT_PUBLIC_CLOUD_CMS_URL}/api/projects/${projectID}/env`,
            {
              method: 'POST',
              credentials: 'include',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ envs: sanitizedEnvs }),
            },
          )

          if (req.status === 200) {
            clearRows()
            reloadProject()
          }

          return
        } catch (e) {
          console.error(e) // eslint-disable-line no-console
        }
      }
    },
    [projectID, reloadProject, clearRows],
  )

  return (
    <Form className={classes.formContent} onSubmit={handleSubmit}>
      {uuids.map((uuid, index) => {
        return (
          <ArrayRow key={uuid} index={index} allowRemove>
            <Text
              required
              label="Key"
              className={classes.newEnvInput}
              path={`newEnvs.${index}.key`}
              validate={(key: string) => validateKey(key, existingEnvKeys)}
            />

            <Text
              required
              label="Value"
              className={classes.newEnvInput}
              path={`newEnvs.${index}.value`}
              validate={validateValue}
            />
          </ArrayRow>
        )
      })}
      <AddArrayRow singularLabel="Environment Variable" pluralLabel="Environment Variables" />
      <div className={classes.actionFooter}>
        <Submit icon={false} label="Save" appearance="secondary" size="small" />
      </div>
    </Form>
  )
}

export const AddEnvs: React.FC = () => {
  return (
    <ArrayProvider>
      <EnvManagement />
    </ArrayProvider>
  )
}
