import React from 'react'
import { AddArrayRow, ArrayRow } from '@forms/fields/Array'
import { ArrayProvider, useArray } from '@forms/fields/Array/context'
import { Text } from '@forms/fields/Text'

import classes from './EnvVars.module.scss'

const NewEnvVarManager: React.FC<{
  className?: string
}> = ({ className }) => {
  const { uuids } = useArray()

  return (
    <div className={[classes.envVars, className].filter(Boolean).join(' ')}>
      <div className={classes.vars}>
        {uuids?.map((uuid, index) => {
          return (
            <ArrayRow key={uuid} index={index} allowRemove>
              <div className={classes.row}>
                <div className={classes.fields}>
                  <Text label="Key" path={`environmentVariables.${index}.key`} />
                  <Text label="Value" path={`environmentVariables.${index}.value`} />
                </div>
              </div>
            </ArrayRow>
          )
        })}
      </div>
      <AddArrayRow />
    </div>
  )
}

export const EnvVars: React.FC<{
  className?: string
}> = ({ className }) => {
  return (
    <ArrayProvider>
      <NewEnvVarManager className={className} />
    </ArrayProvider>
  )
}
