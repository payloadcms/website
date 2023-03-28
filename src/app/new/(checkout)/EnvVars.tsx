import React from 'react'
import { Text } from '@forms/fields/Text'
import { useFormField } from '@forms/useFormField'

import classes from './EnvVars.module.scss'

export const EnvVars: React.FC<{
  className?: string
}> = ({ className }) => {
  const { value: vars, setValue } = useFormField<
    Array<{
      key: string
      value: string
    }>
  >({
    path: 'environmentVariables',
  })

  return (
    <div className={[classes.envVars, className].filter(Boolean).join(' ')}>
      <div className={classes.vars}>
        {vars?.map((envVar, index) => (
          <div key={index} className={classes.item}>
            <Text
              label="Key"
              value={envVar?.key}
              onChange={value => {
                const newVars = [...vars]
                newVars[index] = {
                  key: value,
                  value: envVar?.value,
                }
                setValue(newVars)
              }}
            />
            <Text
              label="Value"
              value={envVar?.value}
              onChange={value => {
                const newVars = [...vars]
                newVars[index] = {
                  key: envVar?.key,
                  value,
                }
                setValue(newVars)
              }}
            />
          </div>
        ))}
      </div>
      <button
        type="button"
        onClick={() =>
          setValue([
            ...(vars || []),
            {
              key: '',
              value: '',
            },
          ])
        }
        className={classes.button}
      >
        Add more
      </button>
    </div>
  )
}
