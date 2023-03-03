'use client'

import * as React from 'react'
import { Text } from '@forms/fields/Text'
import Form from '@forms/Form'
import Submit from '@forms/Submit'

import { Button } from '@components/Button'
import { useRouteData } from '@root/app/dashboard/context'
import { TrashIcon } from '@root/icons/TrashIcon'
import { validateKey, validateValue } from '../validations'

import classes from './index.module.scss'

const generateUUID = () => {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
}

export const AddEnvs: React.FC = () => {
  const { project, refreshProject } = useRouteData()
  const [tempEnvUUIDs, setTempUUIDs] = React.useState([generateUUID()])

  const existingEnvKeys = (project.environmentVariables || []).map(({ key }) => key)
  const projectID = project.id

  const resetTempEnvs = React.useCallback(() => {
    setTempUUIDs([generateUUID()])
  }, [])

  const addTempEnv = () => {
    setTempUUIDs(curr => [...curr, generateUUID()])
  }

  const removeTempEnv = React.useCallback(
    index => {
      if (tempEnvUUIDs.length === 1) {
        resetTempEnvs()
      } else {
        const newEnvs = [...tempEnvUUIDs]
        newEnvs.splice(index, 1)
        setTempUUIDs(newEnvs)
      }
    },
    [tempEnvUUIDs, resetTempEnvs],
  )

  const saveEnvs = React.useCallback(
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
            resetTempEnvs()
            refreshProject()
          }

          return
        } catch (e) {
          console.error(e)
        }
      }

      resetTempEnvs()
    },
    [projectID, resetTempEnvs, refreshProject],
  )

  return (
    <Form className={classes.formContent} onSubmit={saveEnvs}>
      {tempEnvUUIDs.map((id, index) => {
        return (
          <div className={classes.newItemRow} key={id}>
            <div className={classes.newVariableInputs}>
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
            </div>

            <button
              type="button"
              className={classes.trashButton}
              onClick={() => removeTempEnv(index)}
            >
              <TrashIcon />
            </button>
          </div>
        )
      })}
      <div className={classes.addAnotherButtonWrap}>
        <Button
          label="Add another"
          size="small"
          appearance="text"
          onClick={addTempEnv}
          icon="plus"
          fullWidth={false}
          className={classes.addAnotherButton}
        />
      </div>

      <div className={classes.actionFooter}>
        <Submit icon={false} label="Save" appearance="secondary" size="small" />
      </div>
    </Form>
  )
}
