'use client'

import * as React from 'react'
import { toast } from 'react-toastify'
import { revalidateCache } from '@cloud/_actions/revalidateCache'
import { AddArrayRow, ArrayRow } from '@forms/fields/Array'
import { ArrayProvider, useArray } from '@forms/fields/Array/context'
import { Text } from '@forms/fields/Text'
import Form from '@forms/Form'
import Submit from '@forms/Submit'
import { OnSubmit } from '@forms/types'

import { Project } from '@root/payload-cloud-types'
import { validateKey, validateValue } from '../validations'

import classes from './index.module.scss'

type AddEnvsProps = {
  projectID: Project['id']
  envs: Project['environmentVariables']
}

export const AddEnvsComponent: React.FC<AddEnvsProps> = props => {
  const { envs, projectID } = props

  const { uuids, clearRows } = useArray()

  const existingEnvKeys = (envs || []).map(({ key }) => key || '')

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

          const res = await req.json()

          if (!req.ok) {
            toast.error(res.message)
            return
          }

          if (req.status === 200) {
            toast.success('Environment variable added successfully')

            clearRows()

            await revalidateCache({
              tag: `project_${projectID}`,
            })
          }

          return
        } catch (e) {
          console.error(e) // eslint-disable-line no-console
        }
      }
    },
    [projectID, clearRows],
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
        <Submit icon={false} label="Save" />
      </div>
    </Form>
  )
}

export const AddEnvs: React.FC<AddEnvsProps> = props => {
  return (
    <ArrayProvider>
      <AddEnvsComponent {...props} />
    </ArrayProvider>
  )
}
