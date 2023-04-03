import React, { Fragment } from 'react'

import { Heading } from '@components/Heading'
import { Team } from '@root/payload-cloud-types'
import { formatDate } from '@root/utilities/format-date-time'
import { TeamMemberRow } from './TeamMemberRow'

import classes from './index.module.scss'

export const TeamMembers: React.FC<{
  team: Team
  className?: string
}> = ({ className, team }) => {
  return (
    <div className={[classes.members, className].filter(Boolean).join(' ')}>
      <Heading element="h6" marginTop={false}>
        Team members
      </Heading>
      {team?.members?.map((member, index) => {
        return (
          <TeamMemberRow
            key={member?.id}
            index={index}
            email={typeof member?.user === 'string' ? member?.user : member?.user?.email}
            roles={member?.roles}
            footer={
              <Fragment>
                {`Joined On ${formatDate({
                  date: member?.joinedOn || '',
                })}`}
              </Fragment>
            }
          />
        )
      })}
    </div>
  )
}
