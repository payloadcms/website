import React, { Fragment } from 'react'

import { Heading } from '@components/Heading'
import { Team } from '@root/payload-cloud-types'
import { formatDate } from '@root/utilities/format-date-time'
import { TeamMemberRow } from './TeamMemberRow'

import classes from './index.module.scss'

export const TeamMembers: React.FC<{
  team: Team | null | undefined
  className?: string
  renderHeader?: boolean
  onUpdateRoles?: (index: number, newRoles: ('owner' | 'admin' | 'user')[]) => void
}> = ({ className, team, renderHeader, onUpdateRoles }) => {
  const handleUpdateRoles = (index: number) => (newRoles: ('owner' | 'admin' | 'user')[]) => {
    onUpdateRoles && onUpdateRoles(index, newRoles)
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
            initialRoles={member?.roles}
            footer={
              <Fragment>
                {`Joined On ${formatDate({
                  date: member?.joinedOn || '',
                })}`}
              </Fragment>
            }
            onUpdateRoles={handleUpdateRoles(index)}
          />
        )
      })}
    </div>
  )
}
