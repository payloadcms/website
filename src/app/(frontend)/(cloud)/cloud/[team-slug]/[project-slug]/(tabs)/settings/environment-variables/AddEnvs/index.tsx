'use client'

import type { OnSubmit } from '@forms/types'
import type { Project } from '@root/payload-cloud-types'

import { revalidateCache } from '@cloud/_actions/revalidateCache'
import { ArrayProvider, useArray } from '@forms/fields/Array/context'
import { AddArrayRow, ArrayRow } from '@forms/fields/Array/index'
import { Text } from '@forms/fields/Text/index'
import Form from '@forms/Form/index'
import Submit from '@forms/Submit/index'
import { qs } from '@root/utilities/qs'
import * as React from 'react'
import { toast } from 'sonner'

import { validateKey, validateValue } from '../validations'
import classes from './index.module.scss'

type AddEnvsProps = {
  environmentSlug?: string
  envs: Project['environmentVariables']
  projectID: Project['id']
}

export const AddEnvsComponent: React.FC<AddEnvsProps> = (props) => {
  const { environmentSlug, envs, projectID } = props

  const { clearRows, uuids } = useArray()

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
          const query = qs.stringify({
            env: environmentSlug,
          })
          const req = await fetch(
            `${process.env.NEXT_PUBLIC_CLOUD_CMS_URL}/api/projects/${projectID}/env${
              query ? `?${query}` : ''
            }`,
            {
              body: JSON.stringify({ envs: sanitizedEnvs }),
              credentials: 'include',
              headers: {
                'Content-Type': 'application/json',
              },
              method: 'POST',
            },
          )

          const res = await req.json()

          if (!req.ok) {
            toast.error(res.message)
            return
          }

          if (req.status === 200) {
            toast.success('Environment variable added successfully.')

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
          <ArrayRow allowRemove index={index} key={uuid}>
            <Text
              className={classes.newEnvInput}
              label="Key"
              path={`newEnvs.${index}.key`}
              required
              validate={(key: string) => validateKey(key, existingEnvKeys)}
            />

            <Text
              className={classes.newEnvInput}
              label="Value"
              path={`newEnvs.${index}.value`}
              required
              validate={validateValue}
            />
          </ArrayRow>
        )
      })}
      <AddArrayRow pluralLabel="Environment Variables" singularLabel="Environment Variable" />
      <div className={classes.actionFooter}>
        <Submit icon={false} label="Save" />
      </div>
    </Form>
  )
}

export const AddEnvs: React.FC<AddEnvsProps> = (props) => {
  return (
    <ArrayProvider>
      <AddEnvsComponent {...props} />
    </ArrayProvider>
  )
}
