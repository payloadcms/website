import * as React from 'react'
import { Text } from '@forms/fields/Text'
import Form from '@forms/Form'
import Submit from '@forms/Submit'

import { Button } from '@components/Button'
import { TrashIcon } from '@root/icons/TrashIcon'

import classes from './index.module.scss'

const generateUUID = () => {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
}

type Props = {
  projectID: string
}
export const AddEnvs: React.FC<Props> = ({ projectID }) => {
  const [tempEnvUUIDs, setTempUUIDs] = React.useState([generateUUID()])

  const addTempEnv = () => {
    setTempUUIDs(curr => [...curr, generateUUID()])
  }

  const removeTempEnv = React.useCallback(
    index => {
      const newEnvs = [...tempEnvUUIDs]
      newEnvs.splice(index, 1)
      setTempUUIDs(newEnvs)
    },
    [tempEnvUUIDs],
  )

  const onSubmit = React.useCallback(
    async (_, unflattenedValues) => {
      if (unflattenedValues?.newEnvs?.length > 0) {
        try {
          const req = await fetch(
            `${process.env.NEXT_PUBLIC_CLOUD_CMS_URL}/api/projects/${projectID}/env`,
            {
              method: 'POST',
              credentials: 'include',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ envs: unflattenedValues.newEnvs }),
            },
          )

          if (req.status === 200) {
            const res = await req.json()

            console.log({ res })
          }
        } catch (e) {
          console.error(e)
        }

        return null
      }

      // no envs to add
      return null
    },
    [projectID],
  )

  return (
    <Form className={classes.formContent} onSubmit={onSubmit}>
      {tempEnvUUIDs.map((id, index) => {
        return (
          <div className={classes.newItemRow} key={id}>
            <div className={classes.newVariableInputs}>
              <Text
                required
                label="Name"
                className={classes.newEnvInput}
                path={`newEnvs.${index}.name`}
              />

              <Text
                required
                label="Value"
                className={classes.newEnvInput}
                path={`newEnvs.${index}.value`}
              />

              {/* <Hidden path={`newEnvs.${index}.id`} value={id} /> */}
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

      <div className={classes.actionFooter}>
        <Button label="Add new" size="small" appearance="primary" onClick={addTempEnv} />
        <Submit icon={false} label="Save" appearance="secondary" size="small" />
      </div>
    </Form>
  )
}
