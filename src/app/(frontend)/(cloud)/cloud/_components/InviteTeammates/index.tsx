import { Heading } from '@components/Heading/index'
import { ArrayProvider, useArray } from '@forms/fields/Array/context'
import { AddArrayRow, ArrayRow } from '@forms/fields/Array/index'
import { Select } from '@forms/fields/Select/index'
import { Text } from '@forms/fields/Text/index'
import React from 'react'

import classes from './index.module.scss'

export const userTeamRoles = [
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
]

const Invites: React.FC<{
  className?: string
}> = ({ className }) => {
  const { uuids } = useArray()

  const hasInvites = uuids?.length > 0

  return (
    <div className={[classes.teamInvites, className].filter(Boolean).join(' ')}>
      {hasInvites && (
        <div>
          <Heading element="h4" marginTop={false}>
            Invite your teammates
          </Heading>
          <div className={classes.invites}>
            {uuids?.map((uuid, index) => {
              return (
                <ArrayRow allowRemove className={classes.fieldWrap} index={index} key={uuid}>
                  <Text
                    className={classes.field}
                    initialValue=""
                    label="Email address"
                    path={`sendEmailInvitationsTo.${index}.email`}
                    required
                  />
                  <Select
                    className={classes.field}
                    initialValue={['user']}
                    isMulti
                    label="Roles"
                    options={userTeamRoles}
                    path={`sendEmailInvitationsTo.${index}.roles`}
                    required
                  />
                </ArrayRow>
              )
            })}
          </div>
        </div>
      )}
      <AddArrayRow baseLabel="Invite" pluralLabel="Teammates" singularLabel="Teammate" />
    </div>
  )
}

export const InviteTeammates = (props: { clearCount?: number }) => {
  const { clearCount } = props

  return (
    <ArrayProvider clearCount={clearCount} instantiateEmpty>
      <Invites />
    </ArrayProvider>
  )
}
