'use client'

import * as React from 'react'
import { toast } from 'sonner'
import { revalidateCache } from '@cloud/_actions/revalidateCache.js'
import { CollapsibleGroup } from '@faceless-ui/collapsibles'
import { useModal } from '@faceless-ui/modal'
import { Text } from '@forms/fields/Text/index.js'
import { Textarea } from '@forms/fields/Textarea/index.js'
import Form from '@forms/Form/index.js'
import Submit from '@forms/Submit/index.js'

import { Button } from '@components/Button/index.js'
import { Heading } from '@components/Heading/index.js'
import { ModalWindow } from '@components/ModalWindow/index.js'
import { Accordion } from '@components/Accordion/index.js'
import { Project } from '@root/payload-cloud-types.js'
import { validateKey, validateValue } from '../validations.js'

import classes from './index.module.scss'

const envKeyFieldPath = 'envKey'
const envValueFieldPath = 'envValue'

type Props = {
  envs: Project['environmentVariables']
  projectID: Project['id']
  // env: Project['environmentVariables'][0]
  env: {
    key?: string
    value?: string
    id?: string
  }
}

export const ManageEnv: React.FC<Props> = ({ envs, projectID, env: { key, id } }) => {
  const modalSlug = `delete-env-${id}`
  const [fetchedEnvValue, setFetchedEnvValue] = React.useState<string | undefined>(undefined)
  const { closeModal, openModal } = useModal()
  const existingEnvKeys = (envs || []).reduce((acc: string[], { key: existingKey }) => {
    if (existingKey && existingKey !== key) {
      acc.push(existingKey)
    }
    return acc
  }, [])

  const fetchEnv = React.useCallback(async (): Promise<string | null> => {
    try {
      const req = await fetch(
        `${process.env.NEXT_PUBLIC_CLOUD_CMS_URL}/api/projects/${projectID}/env?key=${key}`,
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
  }, [projectID, key])

  const updateEnv = React.useCallback(
    async ({ data }) => {
      const newEnvKey = data[envKeyFieldPath]
      const newEnvValue = data[envValueFieldPath]

      if (typeof newEnvValue === 'string' && typeof newEnvKey === 'string' && id) {
        try {
          const req = await fetch(
            `${process.env.NEXT_PUBLIC_CLOUD_CMS_URL}/api/projects/${projectID}/env`,
            {
              method: 'PATCH',
              credentials: 'include',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ arrayID: id, key: newEnvKey, value: newEnvValue }),
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
    [projectID, id],
  )

  const deleteEnv = React.useCallback(async () => {
    try {
      const req = await fetch(
        `${process.env.NEXT_PUBLIC_CLOUD_CMS_URL}/api/projects/${projectID}/env?key=${key}`,
        {
          method: 'DELETE',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
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
  }, [projectID, key, closeModal, modalSlug])

  return (
    <>
      <Accordion
        onToggle={async () => {
          if (!fetchedEnvValue && key) {
            const envValue = await fetchEnv()
            if (envValue) setFetchedEnvValue(envValue)
          }
        }}
        label={
          <>
            <p>{key}</p>
            <div>••••••••••••</div>
          </>
        }
        toggleIcon="eye"
      >
        <Form className={classes.accordionFormContent} onSubmit={updateEnv}>
          <Text
            required
            label="Key"
            path={envKeyFieldPath}
            initialValue={key}
            validate={(keyValue: string) => validateKey(keyValue, existingEnvKeys)}
          />

          <Textarea
            copy
            required
            label="Value"
            path={envValueFieldPath}
            initialValue={fetchedEnvValue}
            validate={validateValue}
          />

          <div className={classes.actionFooter}>
            <Button label="Remove" appearance="danger" onClick={() => openModal(modalSlug)} />
            <Submit label="Update" icon={false} />
          </div>
        </Form>
      </Accordion>
      <ModalWindow slug={modalSlug}>
        <div className={classes.modalContent}>
          <Heading marginTop={false} as="h4">
            Are you sure you want to delete this environment variable?
          </Heading>
          <p>
            Deleting an environment variable from a project cannot be undone. You can manually add
            the env back to the project.
          </p>

          <div className={classes.modalActions}>
            <Button label="Cancel" appearance="secondary" onClick={() => closeModal(modalSlug)} />
            <Button label="Delete" appearance="danger" onClick={deleteEnv} />
          </div>
        </div>
      </ModalWindow>
    </>
  )
}

export const ManageEnvs: React.FC<{
  envs: Project['environmentVariables']
  projectID: Project['id']
}> = props => {
  const { envs, projectID } = props

  return (
    <CollapsibleGroup transTime={250} transCurve="ease" allowMultiple>
      <div className={classes.envs}>
        {envs?.map(env => (
          <ManageEnv key={env.id} env={env} envs={envs} projectID={projectID} />
        ))}
      </div>
    </CollapsibleGroup>
  )
}
