'use client'

import * as React from 'react'

import { Button } from '@components/Button'
import { Text } from '@forms/fields/Text'
import Form from '@forms/Form'
import Submit from '@forms/Submit'
import { useRouteData } from '@root/app/cloud/context'
import { TrashIcon } from '@root/icons/TrashIcon'
import { validateKey, validateValue } from '../validations'

import classes from './index.module.scss'

const generateUUID = () => {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
}

export const AddEnvs: React.FC = () => {
  const { project, reloadProject } = useRouteData()
  const projectID = project.id

  const [rows, setRows] = React.useState([generateUUID()])
  const existingEnvKeys = (project.environmentVariables || []).map(({ key }) => key || '')

  const addRow = React.useCallback(() => {
    setRows(prev => [...prev, generateUUID()])
  }, [])

  const removeRow = React.useCallback((index: number) => {
    setRows(prev => prev.filter((_, i) => i !== index))
  }, [])

  const clearRows = React.useCallback(() => {
    setRows([generateUUID()])
  }, [])

  const handleSubmit = React.useCallback(
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
            clearRows()
            reloadProject()
          }

          return
        } catch (e) {
          console.error(e)
        }
      }
    },
    [projectID, reloadProject, clearRows],
  )

  return (
    <Form className={classes.formContent} onSubmit={handleSubmit}>
      {rows.map((tempUUID, index) => {
        return (
          <div className={classes.newItemRow} key={tempUUID}>
            <div className={classes.newVariableInputs}>
              <Text
                required
                label="Key"
                className={classes.newEnvInput}
                path={`newEnvs.${index}.key`}
                validate={(key: string) => validateKey(key, existingEnvKeys)}
                initialValue=""
              />

              <Text
                required
                label="Value"
                className={classes.newEnvInput}
                path={`newEnvs.${index}.value`}
                validate={validateValue}
                initialValue=""
              />
            </div>

            <button type="button" className={classes.trashButton} onClick={() => removeRow(index)}>
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
          onClick={addRow}
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
