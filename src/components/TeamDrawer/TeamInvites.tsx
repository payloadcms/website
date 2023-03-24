import React from 'react'
import { AddArrayRow, ArrayRow } from '@forms/fields/Array'
import { useArray } from '@forms/fields/Array/context'
import { Select } from '@forms/fields/Select'
import { Text } from '@forms/fields/Text'

import classes from './TeamInvites.module.scss'

export const TeamInvites: React.FC<{
  className?: string
}> = ({ className }) => {
  const { uuids } = useArray()

  return (
    <div className={[classes.teamInvites, className].filter(Boolean).join(' ')}>
      <h6 className={classes.title}>Team members</h6>
      <p className={classes.description}>Invite others to join your team (or do this later).</p>

      <div className={classes.invites}>
        {uuids?.map((uuid, index) => {
          return (
            <ArrayRow key={uuid} index={index} allowRemove>
              <Text
                label="Email address"
                path={`members.${index}.email`}
                className={classes.arrayRowField}
              />
              <Select
                label="Role"
                path={`members.${index}.role`}
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
                className={classes.arrayRowField}
                initialValue="user"
              />
            </ArrayRow>
          )
        })}
      </div>

      <AddArrayRow />
    </div>
  )
}
