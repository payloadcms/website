import React, { Fragment } from 'react'

import { Heading } from '@components/Heading/index.js'
import { Team, User } from '@root/payload-cloud-types.js'
import { formatDate } from '@root/utilities/format-date-time.js'
import { TeamMemberRow } from './TeamMemberRow.js'

import classes from './index.module.scss'

export type Member = {
  user?: string | User | undefined
  roles?: ('owner' | 'admin' | 'user')[] | undefined
  joinedOn?: string | undefined
  id?: string | undefined
}

export const TeamMembers: React.FC<{
  team: Team | null | undefined
  className?: string
  renderHeader?: boolean
  onUpdateRoles?: (index: number, newRoles: ('owner' | 'admin' | 'user')[], member: Member) => void
  isOwnerOrGlobalAdmin?: boolean
  roles: ('owner' | 'admin' | 'user')[][]
}> = ({ className, team, renderHeader, onUpdateRoles, isOwnerOrGlobalAdmin, roles }) => {
  // Responsible for handling role updates at the team level.
  // When rendering each TeamMemberRow, handleUpdateRoles is called with the index and member information.
  // This call returns a new function, which is then passed down to the TeamMemberRow component as the onUpdateRoles prop.
  const handleUpdateRoles =
    (index: number, member: Member) => (newRoles: ('owner' | 'admin' | 'user')[]) => {
      onUpdateRoles && onUpdateRoles(index, newRoles, member)
    }
  return (
    <div className={[classes.members, className].filter(Boolean).join(' ')}>
      {renderHeader && (
        <Heading element="h6" marginTop={false} marginBottom={false}>
          Team members
        </Heading>
      )}
      {team?.members?.map((member, index) => {
        // Rendering each team member in a row with their details.
        return (
          <TeamMemberRow
            key={index}
            leader={`Member ${(index + 1).toString()}`}
            initialEmail={typeof member?.user === 'string' ? member?.user : member?.user?.email}
            initialRoles={roles[index]}
            footer={
              <Fragment>
                {`Joined On ${formatDate({
                  date: member?.joinedOn || '',
                })}`}
              </Fragment>
            }
            onUpdateRoles={handleUpdateRoles(index, member)}
            isOwnerOrGlobalAdmin={isOwnerOrGlobalAdmin}
          />
        )
      })}
    </div>
  )
}
