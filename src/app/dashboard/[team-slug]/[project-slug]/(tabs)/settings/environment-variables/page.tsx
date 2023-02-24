'use client'

import * as React from 'react'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleGroup,
  CollapsibleToggler,
} from '@faceless-ui/collapsibles'
import { Cell, Grid } from '@faceless-ui/css-grid'
import { Text } from '@forms/fields/Text'
import Form from '@forms/Form'
import Submit from '@forms/Submit'

import { Button } from '@components/Button'
import { Heading } from '@components/Heading'
import { useRouteData } from '@root/app/dashboard/context'
import { EyeIcon } from '@root/icons/EyeIcon'

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

const EnvCollapsible = ({ index, name, projectID, arrayItemID }) => {
  const [fetchedEnvValue, setFetchedEnvValue] = React.useState<string>(undefined)

  return (
    <Collapsible>
      <div className={classes.envCollapsible}>
        <div className={classes.collapsibleHeader}>
          <div className={classes.keyAndPlaceholder}>
            <p className={classes.collapsibleHeadingText}>{name}</p>
            <div className={classes.valuePlaceholder}>••••••••••••</div>
          </div>

          <CollapsibleToggler
            className={classes.toggler}
            onClick={async () => {
              if (!fetchedEnvValue) {
                const envValue = await fetchEnv({ envName: name, projectID })
                if (envValue) setFetchedEnvValue(envValue)
              }
            }}
          >
            <EyeIcon />
          </CollapsibleToggler>
        </div>

        <CollapsibleContent>
          <Form
            className={classes.collapsibleContent}
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

            <div className={classes.actions}>
              <Button label="delete" appearance="error" size="small" />

              <Submit label="save" icon={false} appearance="secondary" />
            </div>
          </Form>
        </CollapsibleContent>
      </div>
    </Collapsible>
  )
}

const AddNewEnvs: React.FC = () => {
  return (
    <CollapsibleGroup>
      <div className={`${classes.collapsibleGroup} ${classes.addNewEnvs}`}>
        <Collapsible>
          <div className={classes.collapsible}>
            <CollapsibleToggler className={classes.collapsibleHeader}>
              <div className={classes.collapsibleHeadingText}>New variables</div>

              <EyeIcon />
            </CollapsibleToggler>

            <CollapsibleContent>
              <Form className={classes.collapsibleContent}>
                <Grid>
                  <Cell start={1} cols={6} colsL={4}>
                    <Text required label="Name" path="environmentVariables.0.name" />
                  </Cell>
                  <Cell start={7} cols={6} startL={5} colsL={4}>
                    <Text required label="Value" path="environmentVariables.0.value" />
                  </Cell>
                </Grid>
              </Form>
              <div></div>
            </CollapsibleContent>
          </div>
        </Collapsible>
      </div>
    </CollapsibleGroup>
  )
}

export default () => {
  const { project } = useRouteData()

  return (
    <div className={classes.envVariables}>
      <div>
        <Heading element="h2" as="h4" marginTop={false}>
          Environment Variables
        </Heading>
        <Button label="learn more" icon="arrow" el="link" href="/" />
      </div>

      <AddNewEnvs />

      <h6>Existing Variables</h6>
      <CollapsibleGroup>
        <div className={classes.collapsibleGroup}>
          {(project.environmentVariables || []).map(({ name, id }, i) => (
            <>
              <EnvCollapsible
                key={id || i}
                index={i}
                name={name}
                projectID={project.id}
                arrayItemID={id}
              />
              <EnvCollapsible
                key={id || i}
                index={i}
                name={name}
                projectID={project.id}
                arrayItemID={id}
              />
            </>
          ))}
        </div>
      </CollapsibleGroup>
    </div>
  )
}
