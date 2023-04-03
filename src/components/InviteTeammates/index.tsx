import React from 'react'
import { AddArrayRow, ArrayRow } from '@forms/fields/Array'
import { ArrayProvider, useArray } from '@forms/fields/Array/context'
import { Select } from '@forms/fields/Select'
import { Text } from '@forms/fields/Text'

import { Heading } from '@components/Heading'
import { BorderBox } from '@root/app/_components/BorderBox'

import classes from './index.module.scss'

const Invites: React.FC<{
  className?: string
}> = ({ className }) => {
  const { uuids } = useArray()

  const hasInvites = uuids?.length > 0

  return (
    <div className={[classes.teamInvites, className].filter(Boolean).join(' ')}>
      {hasInvites && (
        <div>
          <Heading element="h5" marginTop={false}>
            Invite your teammates
          </Heading>
          <div className={classes.invites}>
            {uuids?.map((uuid, index) => {
              return (
                <ArrayRow key={uuid} index={index} allowRemove className={classes.fieldWrap}>
                  <Text
                    label="Email address"
                    path={`sendEmailInvitationsTo.${index}.email`}
                    className={classes.field}
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
                    className={classes.field}
                  />
                </ArrayRow>
              )
            })}
          </div>
        </div>
      )}
      <AddArrayRow baseLabel="Invite" singularLabel="Teammate" pluralLabel="Teammates" />
    </div>
  )
}

export const InviteTeammates = () => {
  return (
    <ArrayProvider instantiateEmpty>
      <Invites />
    </ArrayProvider>
  )
}
