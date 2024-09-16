'use client'

import * as React from 'react'
import Link from 'next/link'

import { useRouter } from 'next/navigation'

import { MaxWidth } from '@components/MaxWidth/index.js'
import { Project, Team } from '@root/payload-cloud-types.js'
import { useAuth } from '@root/providers/Auth/index.js'
import { checkTeamRoles } from '@root/utilities/check-team-roles.js'
import { isExpandedDoc } from '@root/utilities/is-expanded-doc.js'
import { SectionHeader } from '../_layoutComponents/SectionHeader/index.js'

import classes from './page.module.scss'

export const ProjectOwnershipPage: React.FC<{
  project: Project
  team: Team
}> = ({ project: initialProject, team: currentTeam }) => {
  const { user } = useAuth()
  const [project, setProject] = React.useState<Project>(initialProject)
  const router = useRouter()

  const isCurrentTeamOwner = checkTeamRoles(user, currentTeam, ['owner'])

  const teamOptions = user?.teams?.reduce((acc, userTeam) => {
    if (
      userTeam.team &&
      userTeam.team !== 'string' &&
      isExpandedDoc<Team>(userTeam.team) &&
      userTeam?.roles?.length
    ) {
      acc.push({
        value: userTeam.team.id,
        label: `"${userTeam.team.name}" owns this project`,
        slug: userTeam.team.slug,
      })
    }

    return acc
  }, [] as { label: string; slug?: string; value: string }[])

  return (
    <MaxWidth>
      <SectionHeader title="Ownership" />

      {isCurrentTeamOwner && teamOptions ? (
        <div className={classes.noAccess}>
          Contact support at <Link href={`mailto:info@payloadcms.com`}>info@payloadcms.com</Link> to
          transfer project ownership. Note: Projects can only be transferred to teams that have a
          valid payment method.
        </div>
      ) : (
        <div className={classes.noAccess}>
          You do not have permission to change ownership of this project.
        </div>
      )}
    </MaxWidth>
  )
}
