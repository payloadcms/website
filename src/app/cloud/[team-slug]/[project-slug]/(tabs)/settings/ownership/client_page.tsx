'use client'

import * as React from 'react'
import { Text } from '@forms/fields/Text'
import { useField } from '@forms/fields/useField'
import Form from '@forms/Form'
import Submit from '@forms/Submit'
import { useRouter } from 'next/navigation'

import { MaxWidth } from '@root/app/_components/MaxWidth'
import { CloudRadioGroup } from '@root/app/cloud/_components/RadioGroup'
import { useRouteData } from '@root/app/cloud/context'
import { Team } from '@root/payload-cloud-types'
import { useAuth } from '@root/providers/Auth'
import { checkTeamRoles } from '@root/utilities/check-team-roles'
import { isExpandedDoc } from '@root/utilities/is-expanded-doc'
import { SectionHeader } from '../_layoutComponents/SectionHeader'

import classes from './index.module.scss'

type SelectTeamProps = {
  teams: { label: string; slug?: string; value: string }[]
  initialValue?: string
}
const SelectTeam: React.FC<SelectTeamProps> = ({ teams, initialValue }) => {
  const initialTeam = teams.find(team => team.value === initialValue)

  const { value: slugValue, onChange: slugOnChange } = useField<string>({
    path: 'teamSlug',
    required: true,
    initialValue: initialTeam?.slug,
  })

  const handleChange = React.useCallback(
    ({ slug }) => {
      slugOnChange(slug)
    },
    [slugOnChange],
  )

  return (
    <div>
      <CloudRadioGroup
        path="teamID"
        options={teams}
        initialValue={initialValue}
        onChange={handleChange}
      />

      <Text type="hidden" path="teamSlug" initialValue={slugValue || undefined} />
    </div>
  )
}

export const ProjectOwnershipPage = () => {
  const { user } = useAuth()
  const { project, reloadProject, team: currentTeam } = useRouteData()
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

  const onSubmit = React.useCallback(
    async ({ unflattenedData }) => {
      // TODO - toast messages

      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_CLOUD_CMS_URL}/api/projects/${project.id}`,
          {
            method: 'PATCH',
            credentials: 'include',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              team: unflattenedData.teamID,
            }),
          },
        )

        if (res.status === 200) {
          reloadProject()
          router.push(`/cloud/${unflattenedData.teamSlug}/${project.slug}/settings/ownership`)
          // TODO: figure out how to reroute with new team slug
        }
      } catch (e) {
        console.error(e) // eslint-disable-line no-console
      }
    },
    [project.id, reloadProject, router, project.slug],
  )

  return (
    <MaxWidth>
      <SectionHeader
        title="Ownership"
        intro={isCurrentTeamOwner && <p>Manage which team retains ownership over this project.</p>}
      />

      {isCurrentTeamOwner && teamOptions ? (
        <Form onSubmit={onSubmit} className={classes.teamSelect}>
          <SelectTeam teams={teamOptions} initialValue={currentTeam.id} />

          <div className={classes.actionsFooter}>
            <Submit label="Save" icon={false} />
          </div>
        </Form>
      ) : (
        <div className={classes.noAccess}>
          You do not have permission to change ownership of this project.
        </div>
      )}
    </MaxWidth>
  )
}
