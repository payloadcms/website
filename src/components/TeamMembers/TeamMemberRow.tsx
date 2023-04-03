import React from 'react'
import { Select } from '@forms/fields/Select'
import { Text } from '@forms/fields/Text'

import { userTeamRoles } from '@components/InviteTeammates'
import { BorderBox } from '@root/app/_components/BorderBox'

import classes from './TeamMemberRow.module.scss'

export const TeamMemberRow: React.FC<{
  index: number
  email?: string
  roles?: ('owner' | 'admin' | 'user')[]
  footer?: React.ReactNode
}> = props => {
  const { email, roles, index, footer } = props

  return (
    <BorderBox className={classes.member}>
      <p className={classes.memberIndex}>{`Member ${(index + 1).toString().padStart(2, '0')}`}</p>
      <div className={classes.memberFields}>
        <Text disabled value={email} label="Email" />
        <Select isMulti disabled value={roles} label="Roles" options={userTeamRoles} />
      </div>
      <div className={classes.footer}>{footer}</div>
    </BorderBox>
  )
}
