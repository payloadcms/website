import type { Team, User } from '@root/payload-cloud-types'

import { Heading } from '@components/Heading/index'
import { formatDate } from '@root/utilities/format-date-time'
import React, { Fragment } from 'react'

import classes from './index.module.scss'
import { TeamMemberRow } from './TeamMemberRow'

export type Member = {
  id?: string | undefined
  joinedOn?: string | undefined
  roles?: ('admin' | 'owner' | 'user')[] | undefined
  user?: string | undefined | User
}

export const TeamMembers: React.FC<{
  className?: string
  isOwnerOrGlobalAdmin?: boolean
  onUpdateRoles?: (index: number, newRoles: ('admin' | 'owner' | 'user')[], member: Member) => void
  renderHeader?: boolean
  roles: ('admin' | 'owner' | 'user')[][]
  team: null | Team | undefined
}> = ({ className, isOwnerOrGlobalAdmin, onUpdateRoles, renderHeader, roles, team }) => {
  // Responsible for handling role updates at the team level.
  // When rendering each TeamMemberRow, handleUpdateRoles is called with the index and member information.
  // This call returns a new function, which is then passed down to the TeamMemberRow component as the onUpdateRoles prop.
  const handleUpdateRoles =
    (index: number, member: Member) => (newRoles: ('admin' | 'owner' | 'user')[]) => {
      onUpdateRoles && onUpdateRoles(index, newRoles, member)
    }
  return (
    <div className={[classes.members, className].filter(Boolean).join(' ')}>
      {renderHeader && (
        <Heading element="h6" marginBottom={false} marginTop={false}>
          Team members
        </Heading>
      )}
      {team?.members?.map((member, index) => {
        // Rendering each team member in a row with their details.
        return (
          <TeamMemberRow
            disabled
            footer={
              <Fragment>
                {`Joined On ${formatDate({
                  date: member?.joinedOn || '',
                })}`}
              </Fragment>
            }
            initialEmail={typeof member?.user === 'string' ? member?.user : member?.user?.email}
            initialRoles={roles[index]}
            isOwnerOrGlobalAdmin={isOwnerOrGlobalAdmin}
            key={index}
            leader={`Member ${(index + 1).toString()}`}
            onUpdateRoles={handleUpdateRoles(index, member)}
          />
        )
      })}
    </div>
  )
}
