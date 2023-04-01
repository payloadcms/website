import React from 'react'
import { AddArrayRow, ArrayRow } from '@forms/fields/Array'
import { ArrayProvider, useArray } from '@forms/fields/Array/context'
import { Text } from '@forms/fields/Text'

import classes from './EnvVars.module.scss'

const NewEnvVarManager: React.FC<{
  className?: string
}> = ({ className }) => {
  const { uuids } = useArray()

  const hasEnvVars = uuids?.length > 0

  return (
    <div className={[classes.envVars, className].filter(Boolean).join(' ')}>
      {hasEnvVars && (
        <div>
          <h5 className={classes.sectionTitle}>Environment Variables</h5>
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
        </div>
      )}
      <AddArrayRow singularLabel="Environment Variable" pluralLabel="Environment Variables" />
    </div>
  )
}

export const EnvVars: React.FC<{
  className?: string
}> = ({ className }) => {
  return (
    <ArrayProvider instantiateEmpty>
      <NewEnvVarManager className={className} />
    </ArrayProvider>
  )
}
