'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'

import { useRouteData } from '@cloud/context'
import { Text } from '@forms/fields/Text'
import { useField } from '@forms/fields/useField'
import Form from '@forms/Form'
import Submit from '@forms/Submit'
import { Team } from '@root/payload-cloud-types'
import { useAuth } from '@root/providers/Auth'
import { SectionHeader } from '../_layoutComponents/SectionHeader'

import classes from './index.module.scss'

type TeamSelectorProps = {
  teams: { label: string; slug?: string; value: string }[]
  initialValue?: string
}
const TeamSelector: React.FC<TeamSelectorProps> = ({ teams, initialValue }) => {
  const initialTeam = teams.find(team => team.value === initialValue)

  const { value, onChange } = useField<string>({
    path: 'teamID',
    required: true,
    initialValue,
  })

  const { value: slugValue, onChange: slugOnChange } = useField<string>({
    path: 'teamSlug',
    required: true,
    initialValue: initialTeam?.slug,
  })

  const handleChange = React.useCallback(
    ({ value: newValue, slug }) => {
      onChange(newValue)
      slugOnChange(slug)
    },
    [onChange, slugOnChange],
  )

  return (
    <div className={classes.teams}>
      {teams.map((team, index) => {
        const isSelected = String(team.value) === String(value)

        return (
          <div
            key={team.value}
            className={[isSelected && classes.isSelected].filter(Boolean).join(' ')}
          >
            <input
              type="radio"
              id={`teamID-${index}`}
              value={team.value}
              checked={isSelected}
              onChange={() => {
                handleChange({ value: team.value, slug: team.slug })
              }}
              className={classes.radioInput}
            />
            <label htmlFor={`teamID-${index}`} className={classes.radioCard}>
              <div className={classes.styledRadioInput} />
              <span>"{team.label}" owns this project</span>
            </label>
          </div>
        )
      })}

      <Text type="hidden" path="teamSlug" initialValue={slugValue || undefined} />
    </div>
  )
}

export function isExpandedDoc<T>(doc: any): doc is T {
  if (typeof doc === 'object' && doc !== null) return true
  return false
}

export default () => {
  const { user } = useAuth()
  const { project, reloadProject, team: currentTeam } = useRouteData()
  const router = useRouter()

  const isCurrentTeamOwner = user?.teams?.some(userTeam => {
    if (currentTeam.id === (typeof userTeam.team === 'string' ? userTeam.team : userTeam.team.id)) {
      return userTeam?.roles?.includes('owner')
    }
    return false
  })

  const teamOptions = user?.teams?.reduce((acc, userTeam) => {
    if (isExpandedDoc<Team>(userTeam.team) && userTeam?.roles?.length) {
      acc.push({
        value: userTeam.team.id,
        label: userTeam.team?.name || 'No name',
        slug: userTeam.team?.slug,
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
        console.error(e)
      }
    },
    [project.id, reloadProject, router, project.slug],
  )

  return (
    <div className={classes.ownership}>
      <SectionHeader
        title="Ownership"
        intro={isCurrentTeamOwner && <p>Manage which team retains ownership over this project.</p>}
      />

      {isCurrentTeamOwner && teamOptions ? (
        <Form onSubmit={onSubmit} className={classes.teamSelect}>
          <TeamSelector teams={teamOptions} initialValue={currentTeam.id} />

          <div className={classes.actionsFooter}>
            <Submit label="Save" size="small" appearance="secondary" icon={false} />
          </div>
        </Form>
      ) : (
        <div className={classes.noAccess}>
          You do not have permission to change ownership of this project.
        </div>
      )}
    </div>
  )
}
