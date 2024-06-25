import React from 'react'
import { Select } from '@forms/fields/Select/index.js'
import { Text } from '@forms/fields/Text/index.js'

import { userTeamRoles } from '../InviteTeammates/index.js'

import classes from './TeamMemberRow.module.scss'

export const TeamMemberRow: React.FC<{
  leader?: string
  initialEmail?: string
  initialRoles?: ('owner' | 'admin' | 'user')[]
  footer?: React.ReactNode
  onUpdateRoles?: (newRoles: ('owner' | 'admin' | 'user')[]) => void
  isOwnerOrGlobalAdmin?: boolean
}> = props => {
  const { initialEmail, leader, footer, initialRoles, onUpdateRoles, isOwnerOrGlobalAdmin } = props

  // Called when there's a change in the roles of the team member. It triggers the onUpdateRoles prop.
  const handleRolesChange = (newRoles: any) => {
    onUpdateRoles && onUpdateRoles(newRoles)
  }

  const isRoleClearable = initialRoles && initialRoles.length > 1

  return (
    <div className={classes.member}>
      {leader && <p className={classes.leader}>{leader}</p>}
      <div className={classes.memberFields}>
        <Text disabled initialValue={initialEmail} label="Email" />
        <Select
          isMulti
          isClearable={false}
          disabled={!onUpdateRoles || !isOwnerOrGlobalAdmin}
          initialValue={initialRoles}
          value={initialRoles}
          onChange={handleRolesChange}
          label="Roles"
          options={userTeamRoles}
          className={[
            classes.memberSelect,
            (!onUpdateRoles || !isOwnerOrGlobalAdmin || !isRoleClearable) &&
              classes.disabledRoleRemoval,
          ]
            .filter(Boolean)
            .join(' ')}
        />
      </div>
      <div className={classes.footer}>{footer}</div>
    </div>
  )
}
