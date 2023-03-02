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
import { Accordion } from '../Accordion'

import classes from './index.module.scss'

type FetchEnvArgs = {
  envName: string
  projectID: string
}
const fetchEnv = async ({ envName, projectID }: FetchEnvArgs): Promise<string> => {
  try {
    const req = await fetch(
      `${process.env.NEXT_PUBLIC_CLOUD_CMS_URL}/api/projects/${projectID}/env?name=${envName}`,
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
  envName: string
  projectID: string
  envValue: string
  arrayItemID: string
}
const setEnv = async ({
  envName,
  envValue,
  projectID,
  arrayItemID,
}: SetEnvArgs): Promise<string> => {
  try {
    const req = await fetch(
      `${process.env.NEXT_PUBLIC_CLOUD_CMS_URL}/api/projects/${projectID}/env`,
      {
        method: 'PATCH',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ arrayItemID, name: envName, value: envValue }),
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
  name: string
  arrayItemID: string
}
export const RevealEnv: React.FC<Props> = ({ index, name, arrayItemID }) => {
  const [fetchedEnvValue, setFetchedEnvValue] = React.useState<string>(undefined)
  const { refreshProject, project } = useRouteData()
  const { closeModal, openModal } = useModal()
  const projectID = project.id
  const modalSlug = `delete-env-${index}`

  const updateEnv = React.useCallback(
    async ({ data }) => {
      const value = data[`environmentVariables.${index}.value`]
      const newName = data[`environmentVariables.${index}.name`]

      // TODO: alert user based on status code & message

      if (typeof value === 'string') {
        try {
          await setEnv({ envName: newName, projectID, envValue: value, arrayItemID })
          refreshProject()
        } catch (e) {
          console.error(e)
        }
      }
    },
    [projectID, arrayItemID, index, refreshProject],
  )

  const deleteEnv = React.useCallback(async () => {
    try {
      const req = await fetch(
        `${process.env.NEXT_PUBLIC_CLOUD_CMS_URL}/api/projects/${projectID}/env?name=${name}`,
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
        refreshProject()
      }
    } catch (e) {
      console.error(e)
    } finally {
      closeModal(modalSlug)
    }
  }, [projectID, refreshProject, name, closeModal, modalSlug])

  return (
    <Collapsible>
      <div className={classes.row}>
        <Accordion.Header
          onToggle={async () => {
            if (!fetchedEnvValue) {
              const envValue = await fetchEnv({ envName: name, projectID })
              if (envValue) setFetchedEnvValue(envValue)
            }
          }}
          label={
            <>
              <p>{name}</p>
              <div>••••••••••••</div>
            </>
          }
        />

        <Accordion.Content>
          <Form className={classes.accordionFormContent} onSubmit={updateEnv}>
            <Text
              required
              label="Name"
              path={`environmentVariables.${index}.name`}
              initialValue={name}
            />

            <Textarea
              required
              label="Value"
              path={`environmentVariables.${index}.value`}
              initialValue={fetchedEnvValue}
              copy
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
                This action cannot be undone. This will permanently delete the environment variable
                from your project.
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
        </Accordion.Content>
      </div>
    </Collapsible>
  )
}
