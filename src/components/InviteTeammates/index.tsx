import React from 'react'
import { AddArrayRow, ArrayRow } from '@forms/fields/Array'
import { ArrayProvider, useArray } from '@forms/fields/Array/context'
import { Select } from '@forms/fields/Select'
import { Text } from '@forms/fields/Text'

import { BorderBox } from '@root/app/_components/BorderBox'

import classes from './index.module.scss'

const Invites: React.FC<{
  className?: string
}> = ({ className }) => {
  const { uuids } = useArray()

  return (
    <BorderBox className={[classes.teamInvites, className].filter(Boolean).join(' ')}>
      <h6 className={classes.title}>Invite others</h6>
      {/* <p className={classes.description}>Invite others to join your team.</p> */}
      <div className={classes.invites}>
        {uuids?.map((uuid, index) => {
          return (
            <ArrayRow key={uuid} index={index} allowRemove>
              <Text
                label="Email address"
                path={`sendEmailInvitationsTo.${index}.email`}
                className={classes.arrayRowField}
              />
              <Select
                label="Roles"
                path={`sendEmailInvitationsTo.${index}.roles`}
                options={[
                  {
                    label: 'Owner',
                    value: 'owner',
                  },
                  {
                    label: 'Admin',
                    value: 'admin',
                  },
                  {
                    label: 'User',
                    value: 'user',
                  },
                ]}
                isMulti
                className={classes.arrayRowField}
              />
            </ArrayRow>
          )
        })}
      </div>
      <AddArrayRow singularLabel="Invite" pluralLabel="Invites" />
    </BorderBox>
  )
}

export const InviteTeammates = () => {
  return (
    <ArrayProvider>
      <Invites />
    </ArrayProvider>
  )
}
