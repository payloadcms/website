import React, { Fragment } from 'react'

import { Heading } from '@components/Heading'
import { Team, User } from '@root/payload-cloud-types'
import { formatDate } from '@root/utilities/format-date-time'
import { TeamMemberRow } from './TeamMemberRow'

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
  isOwner: boolean
  roles: ('owner' | 'admin' | 'user')[][]
}> = ({ className, team, renderHeader, onUpdateRoles, isOwner, roles }) => {
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
            isOwner={isOwner}
          />
        )
      })}
    </div>
  )
}
