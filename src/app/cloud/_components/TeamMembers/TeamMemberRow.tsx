import React from 'react'
import { Select } from '@forms/fields/Select'
import { Text } from '@forms/fields/Text'

import { userTeamRoles } from '../InviteTeammates'

import classes from './TeamMemberRow.module.scss'

export const TeamMemberRow: React.FC<{
  leader?: string
  initialEmail?: string
  initialRoles?: ('owner' | 'admin' | 'user')[]
  footer?: React.ReactNode
  onUpdateRoles?: (newRoles: ('owner' | 'admin' | 'user')[]) => void
  isOwner: boolean
}> = props => {
  const { initialEmail, leader, footer, initialRoles, onUpdateRoles, isOwner } = props

  const [roles, setRoles] = React.useState(initialRoles)

  const handleRolesChange = (newRoles: any) => {
    setRoles(newRoles)
    onUpdateRoles && onUpdateRoles(newRoles)
  }

  return (
    <div className={classes.member}>
      {leader && <p className={classes.leader}>{leader}</p>}
      <div className={classes.memberFields}>
        <Text disabled initialValue={initialEmail} label="Email" />
        <Select
          isMulti
          disabled={!onUpdateRoles || !isOwner}
          initialValue={initialRoles}
          value={roles}
          onChange={handleRolesChange}
          label="Roles"
          options={userTeamRoles}
        />
      </div>
      <div className={classes.footer}>{footer}</div>
    </div>
  )
}
