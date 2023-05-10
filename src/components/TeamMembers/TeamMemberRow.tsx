import React from 'react'
import { Select } from '@forms/fields/Select'
import { Text } from '@forms/fields/Text'

import { userTeamRoles } from '@components/InviteTeammates'

import classes from './TeamMemberRow.module.scss'

export const TeamMemberRow: React.FC<{
  leader?: string
  initialEmail?: string
  initialRoles?: ('owner' | 'admin' | 'user')[]
  footer?: React.ReactNode
}> = props => {
  const { initialEmail, leader, footer, initialRoles } = props

  return (
    <div className={classes.member}>
      {leader && <p className={classes.leader}>{leader}</p>}
      <div className={classes.memberFields}>
        <Text disabled initialValue={initialEmail} label="Email" />
        <Select
          isMulti
          disabled
          initialValue={initialRoles}
          label="Roles"
          options={userTeamRoles}
        />
      </div>
      <div className={classes.footer}>{footer}</div>
    </div>
  )
}
