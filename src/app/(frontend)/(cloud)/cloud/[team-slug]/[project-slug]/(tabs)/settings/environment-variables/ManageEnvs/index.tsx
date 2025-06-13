'use client'

import type { Project } from '@root/payload-cloud-types'

import { revalidateCache } from '@cloud/_actions/revalidateCache'
import { Accordion } from '@components/Accordion/index'
import { Button } from '@components/Button/index'
import { Heading } from '@components/Heading/index'
import { ModalWindow } from '@components/ModalWindow/index'
import { CollapsibleGroup } from '@faceless-ui/collapsibles'
import { useModal } from '@faceless-ui/modal'
import { Text } from '@forms/fields/Text/index'
import { Textarea } from '@forms/fields/Textarea/index'
import Form from '@forms/Form/index'
import Submit from '@forms/Submit/index'
import { qs } from '@root/utilities/qs'
import * as React from 'react'
import { toast } from 'sonner'

import { validateKey, validateValue } from '../validations'
import classes from './index.module.scss'

const envKeyFieldPath = 'envKey'
const envValueFieldPath = 'envValue'

type Props = {
  // env: Project['environmentVariables'][0]
  env: {
    id?: string
    key?: string
    value?: string
  }
  environmentSlug?: string
  envs: Project['environmentVariables']
  projectID: Project['id']
}

export const ManageEnv: React.FC<Props> = ({
  env: { id, key },
  environmentSlug,
  envs,
  projectID,
}) => {
  const modalSlug = `delete-env-${id}`
  const [fetchedEnvValue, setFetchedEnvValue] = React.useState<string | undefined>(undefined)
  const { closeModal, openModal } = useModal()
  const existingEnvKeys = (envs || []).reduce((acc: string[], { key: existingKey }) => {
    if (existingKey && existingKey !== key) {
      acc.push(existingKey)
    }
    return acc
  }, [])

  const fetchEnv = React.useCallback(async (): Promise<null | string> => {
    try {
      const query = qs.stringify({
        env: environmentSlug,
        key,
      })
      const req = await fetch(
        `${process.env.NEXT_PUBLIC_CLOUD_CMS_URL}/api/projects/${projectID}/env${`?${query}`}`,
        {
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
        },
      )

      if (req.status === 200) {
        const res = await req.json()
        return res.value
      }
    } catch (e) {
      console.error(e) // eslint-disable-line no-console
    }

    return null
  }, [environmentSlug, key, projectID])

  const updateEnv = React.useCallback(
    async ({ data }) => {
      const newEnvKey = data[envKeyFieldPath]
      const newEnvValue = data[envValueFieldPath]

      if (typeof newEnvValue === 'string' && typeof newEnvKey === 'string' && id) {
        try {
          const query = qs.stringify({
            env: environmentSlug,
          })
          const req = await fetch(
            `${process.env.NEXT_PUBLIC_CLOUD_CMS_URL}/api/projects/${projectID}/env${
              query ? `?${query}` : ''
            }`,
            {
              body: JSON.stringify({ arrayID: id, key: newEnvKey, value: newEnvValue }),
              credentials: 'include',
              headers: {
                'Content-Type': 'application/json',
              },
              method: 'PATCH',
            },
          )

          const res = await req.json()

          if (!req.ok) {
            toast.error(res.message)
            return
          }

          if (req.status === 200) {
            toast.success('Environment variable updated successfully.')

            // TODO: set in state

            await revalidateCache({
              tag: `project_${projectID}`,
            })

            return res.value
          }
        } catch (e) {
          console.error(e) // eslint-disable-line no-console
        }
      }

      return null
    },
    [id, environmentSlug, projectID],
  )

  const deleteEnv = React.useCallback(async () => {
    try {
      const query = qs.stringify({
        env: environmentSlug,
        key,
      })
      const req = await fetch(
        `${process.env.NEXT_PUBLIC_CLOUD_CMS_URL}/api/projects/${projectID}/env?${query}`,
        {
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
          method: 'DELETE',
        },
      )

      // TODO: alert user based on status code & message

      if (req.status === 200) {
        // reloadProject()
      }
    } catch (e) {
      console.error(e) // eslint-disable-line no-console
    } finally {
      closeModal(modalSlug)
    }
  }, [environmentSlug, key, projectID, closeModal, modalSlug])

  return (
    <>
      <Accordion
        label={
          <>
            <p>{key}</p>
            <div>••••••••••••</div>
          </>
        }
        onToggle={async () => {
          if (!fetchedEnvValue && key) {
            const envValue = await fetchEnv()
            if (envValue) {
              setFetchedEnvValue(envValue)
            }
          }
        }}
        toggleIcon="eye"
      >
        <Form className={classes.accordionFormContent} onSubmit={updateEnv}>
          <Text
            initialValue={key}
            label="Key"
            path={envKeyFieldPath}
            required
            validate={(keyValue: string) => validateKey(keyValue, existingEnvKeys)}
          />

          <Textarea
            copy
            initialValue={fetchedEnvValue}
            label="Value"
            path={envValueFieldPath}
            required
            validate={validateValue}
          />

          <div className={classes.actionFooter}>
            <Button appearance="danger" label="Remove" onClick={() => openModal(modalSlug)} />
            <Submit icon={false} label="Update" />
          </div>
        </Form>
      </Accordion>
      <ModalWindow slug={modalSlug}>
        <div className={classes.modalContent}>
          <Heading as="h4" marginTop={false}>
            Are you sure you want to delete this environment variable?
          </Heading>
          <p>
            Deleting an environment variable from a project cannot be undone. You can manually add
            the env back to the project.
          </p>

          <div className={classes.modalActions}>
            <Button appearance="secondary" label="Cancel" onClick={() => closeModal(modalSlug)} />
            <Button appearance="danger" label="Delete" onClick={deleteEnv} />
          </div>
        </div>
      </ModalWindow>
    </>
  )
}

export const ManageEnvs: React.FC<{
  environmentSlug?: string
  envs: Project['environmentVariables']
  projectID: Project['id']
}> = (props) => {
  const { environmentSlug, envs, projectID } = props

  return (
    <CollapsibleGroup allowMultiple transCurve="ease" transTime={250}>
      <div className={classes.envs}>
        {envs?.map((env) => (
          <ManageEnv
            env={env}
            environmentSlug={environmentSlug}
            envs={envs}
            key={env.id}
            projectID={projectID}
          />
        ))}
      </div>
    </CollapsibleGroup>
  )
}
