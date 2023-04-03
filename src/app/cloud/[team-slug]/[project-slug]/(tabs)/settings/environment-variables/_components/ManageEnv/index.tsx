import * as React from 'react'
import { Collapsible } from '@faceless-ui/collapsibles'
import { useModal } from '@faceless-ui/modal'
import { Text } from '@forms/fields/Text'
import { Textarea } from '@forms/fields/Textarea'
import Form from '@forms/Form'
import Submit from '@forms/Submit'

import { Button } from '@components/Button'
import { Heading } from '@components/Heading'
import { ModalWindow } from '@components/ModalWindow'
import { Accordion } from '@root/app/cloud/_components/Accordion'
import { useRouteData } from '@root/app/cloud/context'
import { validateKey, validateValue } from '../validations'

// import { Project } from '@root/payload-cloud-types'
import classes from './index.module.scss'

const envKeyFieldPath = 'envKey'
const envValueFieldPath = 'envValue'

type Props = {
  // env: Project['environmentVariables'][0]
  env: {
    key?: string
    value?: string
    id?: string
  }
}
export const ManageEnv: React.FC<Props> = ({ env: { key, id } }) => {
  const modalSlug = `delete-env-${id}`
  const [fetchedEnvValue, setFetchedEnvValue] = React.useState<string | undefined>(undefined)
  const { reloadProject, project } = useRouteData()
  const { closeModal, openModal } = useModal()
  const projectID = project.id
  const existingEnvKeys = (project.environmentVariables || []).reduce(
    (acc: string[], { key: existingKey }) => {
      if (existingKey && existingKey !== key) {
        acc.push(existingKey)
      }
      return acc
    },
    [],
  )

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

          // TODO: alert user based on status code & message

          if (req.status === 200) {
            const res = await req.json()
            reloadProject()
            return res.value
          }
        } catch (e) {
          console.error(e) // eslint-disable-line no-console
        }
      }

      return null
    },
    [projectID, id, reloadProject],
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
        reloadProject()
      }
    } catch (e) {
      console.error(e) // eslint-disable-line no-console
    } finally {
      closeModal(modalSlug)
    }
  }, [projectID, reloadProject, key, closeModal, modalSlug])

  return (
    <>
      <Collapsible>
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
      </Collapsible>

      <ModalWindow slug={modalSlug}>
        <div className={classes.modalContent}>
          <Heading marginTop={false} as="h5">
            Are you sure you want to delete this environment variable?
          </Heading>
          <p>
            Deleting an environment variable from a project cannot be undone. You can manually add
            the env back to the project.
          </p>

          <div className={classes.modalActions}>
            <Button label="cancel" appearance="secondary" onClick={() => closeModal(modalSlug)} />
            <Button label="delete" appearance="danger" onClick={deleteEnv} />
          </div>
        </div>
      </ModalWindow>
    </>
  )
}
