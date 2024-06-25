import React from 'react'
import { AddArrayRow, ArrayRow } from '@forms/fields/Array/index.js'
import { ArrayProvider, useArray } from '@forms/fields/Array/context.js'
import { Text } from '@forms/fields/Text/index.js'

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
              <ArrayRow key={uuid} index={index} allowRemove>
                <div className={classes.row}>
                  <div className={classes.fields}>
                    <Text label="Key" path={`environmentVariables.${index}.key`} initialValue="" />
                    <Text
                      label="Value"
                      path={`environmentVariables.${index}.value`}
                      initialValue=""
                    />
                  </div>
                </div>
              </ArrayRow>
            )
          })}
        </div>
      </div>
      <AddArrayRow singularLabel="Environment Variable" pluralLabel="Environment Variables" />
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
