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
import { useRouteData } from '@root/app/dashboard/context'
import { Accordion } from '@dashboard/_components/Accordion'
import { validateKey, validateValue } from '../validations'

import classes from './index.module.scss'

type FetchEnvArgs = {
  envKey: string
  projectID: string
}
const fetchEnv = async ({ envKey, projectID }: FetchEnvArgs): Promise<string | null> => {
  try {
    const req = await fetch(
      `${process.env.NEXT_PUBLIC_CLOUD_CMS_URL}/api/projects/${projectID}/env?key=${envKey}`,
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
    console.error(e)
  }

  return null
}

type SetEnvArgs = {
  envKey: string
  projectID: string
  envValue: string
  arrayItemID: string
}
const setEnv = async ({
  envKey,
  envValue,
  projectID,
  arrayItemID,
}: SetEnvArgs): Promise<string | null> => {
  try {
    const req = await fetch(
      `${process.env.NEXT_PUBLIC_CLOUD_CMS_URL}/api/projects/${projectID}/env`,
      {
        method: 'PATCH',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ arrayItemID, key: envKey, value: envValue }),
      },
    )

    if (req.status === 200) {
      const res = await req.json()

      return res.value
    }
  } catch (e) {
    console.error(e)
  }

  return null
}

type Props = {
  index: number
  envKey?: string
  arrayItemID?: string
}
export const ManageEnv: React.FC<Props> = ({ index, envKey, arrayItemID }) => {
  const [fetchedEnvValue, setFetchedEnvValue] = React.useState<string | undefined>(undefined)
  const { reloadProject, project } = useRouteData()
  const { closeModal, openModal } = useModal()
  const projectID = project.id
  const modalSlug = `delete-env-${index}`
  const existingEnvKeys = (project.environmentVariables || []).reduce((acc: string[], { key }) => {
    if (key && key !== envKey) {
      acc.push(key)
    }
    return acc
  }, [])

  const updateEnv = React.useCallback(
    async ({ data }) => {
      const newEnvValue = data[`environmentVariables.${index}.value`]
      const newEnvKey = data[`environmentVariables.${index}.key`]

      // TODO: alert user based on status code & message

      if (typeof newEnvValue === 'string' && typeof newEnvKey === 'string' && arrayItemID) {
        try {
          await setEnv({ envKey: newEnvKey, projectID, envValue: newEnvValue, arrayItemID })
          reloadProject()
        } catch (e) {
          console.error(e)
        }
      }
    },
    [projectID, arrayItemID, index, reloadProject],
  )

  const deleteEnv = React.useCallback(async () => {
    try {
      const req = await fetch(
        `${process.env.NEXT_PUBLIC_CLOUD_CMS_URL}/api/projects/${projectID}/env?key=${envKey}`,
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
      console.error(e)
    } finally {
      closeModal(modalSlug)
    }
  }, [projectID, reloadProject, envKey, closeModal, modalSlug])

  return (
    <Collapsible>
      <Accordion
        onToggle={async () => {
          if (!fetchedEnvValue && envKey) {
            const envValue = await fetchEnv({ envKey, projectID })
            if (envValue) setFetchedEnvValue(envValue)
          }
        }}
        label={
          <>
            <p>{envKey}</p>
            <div>••••••••••••</div>
          </>
        }
      >
        <>
          <Form className={classes.accordionFormContent} onSubmit={updateEnv}>
            <Text
              required
              label="Key"
              path={`environmentVariables.${index}.key`}
              initialValue={envKey}
              validate={(key: string) => validateKey(key, existingEnvKeys)}
            />

            <Textarea
              required
              label="Value"
              path={`environmentVariables.${index}.value`}
              initialValue={fetchedEnvValue}
              copy
              validate={validateValue}
            />

            <div className={classes.actionFooter}>
              <Button
                label="delete"
                appearance="danger"
                size="small"
                onClick={() => openModal(modalSlug)}
              />
              <Submit label="update" icon={false} appearance="secondary" size="small" />
            </div>
          </Form>

          <ModalWindow slug={modalSlug}>
            <div className={classes.modalContent}>
              <Heading marginTop={false} as="h5">
                Are you sure you want to delete this environment variable?
              </Heading>
              <p>
                Deleting an environment variable from a project cannot be undone. You can manually
                add the env back to the project.
              </p>

              <div className={classes.modalActions}>
                <Button
                  label="cancel"
                  appearance="secondary"
                  onClick={() => closeModal(modalSlug)}
                />
                <Button label="delete" appearance="danger" onClick={deleteEnv} />
              </div>
            </div>
          </ModalWindow>
        </>
      </Accordion>
    </Collapsible>
  )
}