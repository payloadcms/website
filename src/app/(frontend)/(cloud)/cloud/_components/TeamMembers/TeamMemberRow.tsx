import { Select } from '@forms/fields/Select/index'
import { Text } from '@forms/fields/Text/index'
import React from 'react'

import { userTeamRoles } from '../InviteTeammates/index'
import classes from './TeamMemberRow.module.scss'

export const TeamMemberRow: React.FC<{
  disabled?: boolean
  footer?: React.ReactNode
  initialEmail?: string
  initialRoles?: ('admin' | 'owner' | 'user')[]
  isOwnerOrGlobalAdmin?: boolean
  leader?: string
  onUpdateRoles?: (newRoles: ('admin' | 'owner' | 'user')[]) => void
}> = (props) => {
  const {
    disabled,
    footer,
    initialEmail,
    initialRoles,
    isOwnerOrGlobalAdmin,
    leader,
    onUpdateRoles,
  } = props

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
          className={[
            classes.memberSelect,
            (!onUpdateRoles || !isOwnerOrGlobalAdmin || !isRoleClearable) &&
              classes.disabledRoleRemoval,
          ]
            .filter(Boolean)
            .join(' ')}
          disabled={!onUpdateRoles || !isOwnerOrGlobalAdmin || disabled}
          initialValue={initialRoles}
          isClearable={false}
          isMulti
          label="Roles"
          onChange={handleRolesChange}
          options={userTeamRoles}
          value={initialRoles}
        />
      </div>
      <div className={classes.footer}>{footer}</div>
    </div>
  )
}
