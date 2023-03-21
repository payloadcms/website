import React from 'react'

import { Select } from '@forms/fields/Select'
import { Text } from '@forms/fields/Text'
import { useFormField } from '@forms/useFormField'

import classes from './TeamMembers.module.scss'

export const TeamMembers: React.FC<{
  className?: string
}> = ({ className }) => {
  const { value: members, setValue } = useFormField<
    Array<{
      email: string
      role: 'admin' | 'user'
    }>
  >({
    path: 'members',
  })

  return (
    <div className={[classes.teamMembers, className].filter(Boolean).join(' ')}>
      <h6 className={classes.title}>Team members</h6>
      <p className={classes.description}>
        Optionally invite members to your team. You can always invite more team members later.
      </p>
      <div className={classes.members}>
        {members?.map((member, index) => (
          <div key={index} className={classes.item}>
            <Text
              label="Email address"
              value={member?.email}
              onChange={value => {
                const newMembers = [...members]
                newMembers[index] = {
                  ...(newMembers?.[index] || {}),
                  email: value,
                }
                console.log(newMembers)
                setValue(newMembers)
              }}
            />
            <Select
              label="Role"
              value={member?.role}
              onChange={value => {
                const newMembers = [...members]
                newMembers[index] = {
                  ...(newMembers?.[index] || {}),
                  role: ('role' in value ? value.role : value) as 'admin' | 'user',
                }
                setValue(newMembers)
              }}
              options={[
                {
                  label: 'Admin',
                  value: 'admin',
                },
                {
                  label: 'User',
                  value: 'user',
                },
              ]}
            />
          </div>
        ))}
      </div>
      <button
        type="button"
        onClick={() =>
          setValue([
            ...(members || []),
            {
              email: '',
              role: 'user',
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
