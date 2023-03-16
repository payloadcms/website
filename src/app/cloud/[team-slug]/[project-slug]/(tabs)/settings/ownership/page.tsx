'use client'

import * as React from 'react'

import { useRouteData } from '@cloud/context'
import { useField } from '@forms/fields/useField'
import Form from '@forms/Form'
import Submit from '@forms/Submit'
import { useAuth } from '@root/providers/Auth'
import { SectionHeader } from '../_layoutComponents/SectionHeader'

import classes from './index.module.scss'

type TeamSelectorProps = {
  teams: { label: string; value: string }[]
  initialValue?: string
}
const TeamSelector: React.FC<TeamSelectorProps> = ({ teams, initialValue }) => {
  const { value, onChange } = useField<string>({
    path: 'team',
    required: true,
    initialValue,
  })

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
              id={`team-${index}`}
              value={team.value}
              checked={team.value === value}
              onChange={e => onChange(e.target.value)}
              className={classes.radioInput}
            />
            <label htmlFor={`team-${index}`} className={classes.radioCard}>
              <div className={classes.styledRadioInput} />
              <span>"{team.label}" owns this project</span>
            </label>
          </div>
        )
      })}
    </div>
  )
}

export default () => {
  const { user } = useAuth()
  const { project, reloadProject, team: currentTeam } = useRouteData()

  const isCurrentTeamOwner = user?.teams?.some(userTeam => {
    if (currentTeam.id === (typeof userTeam.team === 'string' ? userTeam.team : userTeam.team.id)) {
      return userTeam?.roles?.includes('owner')
    }
    return false
  })

  const teamOptions = user?.teams?.reduce((acc, userTeam) => {
    if (userTeam?.roles?.length) {
      acc.push({
        label: typeof userTeam.team === 'string' ? userTeam.team : userTeam.team.name || 'No name',
        value: typeof userTeam.team === 'string' ? userTeam.team : userTeam.team.id,
      })
    }
    return acc
  }, [] as { label: string; value: string }[])

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
              team: unflattenedData.team,
            }),
          },
        )

        if (res.status === 200) {
          reloadProject()
          // TODO: figure out how to reroute with new team slug
        }
      } catch (e) {
        console.error(e)
      }
    },
    [project.id, reloadProject],
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
