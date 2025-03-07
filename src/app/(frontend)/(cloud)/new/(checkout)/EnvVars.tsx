import { ArrayProvider, useArray } from '@forms/fields/Array/context'
import { AddArrayRow, ArrayRow } from '@forms/fields/Array/index'
import { Text } from '@forms/fields/Text/index'
import React from 'react'

import classes from './EnvVars.module.scss'

const NewEnvVarManager: React.FC<{
  className?: string
}> = ({ className }) => {
  const { uuids } = useArray()

  return (
    <div className={[classes.envVars, className].filter(Boolean).join(' ')}>
      <div>
        <div className={classes.vars}>
          {uuids?.map((uuid, index) => {
            return (
              <ArrayRow allowRemove index={index} key={uuid}>
                <div className={classes.row}>
                  <div className={classes.fields}>
                    <Text initialValue="" label="Key" path={`environmentVariables.${index}.key`} />
                    <Text
                      initialValue=""
                      label="Value"
                      path={`environmentVariables.${index}.value`}
                    />
                  </div>
                </div>
              </ArrayRow>
            )
          })}
        </div>
      </div>
      <AddArrayRow pluralLabel="Environment Variables" singularLabel="Environment Variable" />
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
