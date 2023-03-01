import * as React from 'react'
import { Collapsible } from '@faceless-ui/collapsibles'
import { Text } from '@forms/fields/Text'
import Form from '@forms/Form'
import Submit from '@forms/Submit'

import { Button } from '@components/Button'
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
  projectID: string
  arrayItemID: string
}
export const EnvReveal: React.FC<Props> = ({ index, name, projectID, arrayItemID }) => {
  const [fetchedEnvValue, setFetchedEnvValue] = React.useState<string>(undefined)

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
          <Form
            className={classes.accordionFormContent}
            onSubmit={async unflattenedValues => {
              const value = unflattenedValues[`environmentVariables.${index}.value`]
              if (typeof value === 'string') {
                await setEnv({ envName: name, projectID, envValue: value, arrayItemID })
              }
            }}
          >
            <Text
              required
              label="Name"
              path={`environmentVariables.${index}.name`}
              initialValue={name}
            />

            <Text
              required
              label="Value"
              path={`environmentVariables.${index}.value`}
              initialValue={fetchedEnvValue}
              copy
            />

            <div className={classes.actionFooter}>
              <Button label="delete" appearance="error" size="small" />
              <Submit label="save" icon={false} appearance="secondary" size="small" />
            </div>
          </Form>
        </Accordion.Content>
      </div>
    </Collapsible>
  )
}
