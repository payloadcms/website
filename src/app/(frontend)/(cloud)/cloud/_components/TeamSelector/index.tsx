import React, { Fragment, useEffect } from 'react'
import { components } from 'react-select'
import { useTeamDrawer } from '@cloud/_components/TeamDrawer/index.js'
import { Select } from '@forms/fields/Select/index.js'

import { LoadingShimmer } from '@components/LoadingShimmer/index.js'
import { Team, User } from '@root/payload-cloud-types.js'

import classes from './index.module.scss'

const SelectMenuButton = props => {
  const {
    selectProps: {
      selectProps: { TeamDrawerToggler },
    },
  } = props

  return (
    <components.MenuList {...props}>
      {props.children}
      {TeamDrawerToggler}
    </components.MenuList>
  )
}

export const TeamSelector: React.FC<{
  value?: string
  onChange?: (value?: Team) => void // eslint-disable-line no-unused-vars
  className?: string
  allowEmpty?: boolean
  initialValue?: string
  label?: string | false
  required?: boolean
  user?: User | null
}> = props => {
  const {
    onChange,
    value: valueFromProps,
    className,
    allowEmpty,
    initialValue,
    required,
    user,
  } = props

  const teams = user && user?.teams?.map(({ team }) => team)
  const [selectedTeam, setSelectedTeam] = React.useState<Team['id'] | 'none' | undefined>(
    initialValue || 'none',
  )

  const prevSelectedTeam = React.useRef<Team['id'] | 'none' | undefined>(selectedTeam)
  const teamToSelectAfterUserUpdates = React.useRef<string | undefined>(undefined)

  const [TeamDrawer, TeamDrawerToggler] = useTeamDrawer({
    team: teams?.find(
      team => typeof team === 'object' && team !== null && team.id === selectedTeam,
    ) as Team,
  })

  // allow external control of the selection
  useEffect(() => {
    if (valueFromProps === selectedTeam) {
      setSelectedTeam(valueFromProps)
    }
  }, [valueFromProps, selectedTeam])

  // report the selection to the parent
  useEffect(() => {
    if (prevSelectedTeam.current !== selectedTeam) {
      prevSelectedTeam.current = selectedTeam

      const foundTeam = teams?.find(
        team => typeof team === 'object' && team !== null && team.id === selectedTeam,
      ) as Team

      if (typeof onChange === 'function') onChange(foundTeam)
    }
  }, [onChange, selectedTeam, teams])

  useEffect(() => {
    if (user && teamToSelectAfterUserUpdates.current) {
      setSelectedTeam(teamToSelectAfterUserUpdates.current)
      teamToSelectAfterUserUpdates.current = undefined
    }
  }, [user])

  const options = (
    user?.teams && user.teams?.length > 0
      ? ([
          ...user?.teams
            ?.map(({ team }) => {
              if (!team) return null
              return {
                label: typeof team === 'string' ? team : team?.name || team?.id,
                value: typeof team === 'string' ? team : team?.id,
              }
            })
            .filter(Boolean),
        ] as any)
      : [
          {
            label: 'No teams found',
            value: 'no-teams',
          },
        ]
  ) as any

  const valueNotFound = selectedTeam && !options.find(option => option.value === selectedTeam)

  if (selectedTeam !== 'none' && valueNotFound) {
    options.push({
      label: `Team ${selectedTeam}`,
      value: selectedTeam,
    })
  }

  return (
    <Fragment>
      <div className={[classes.teamSelector, className].filter(Boolean).join(' ')}>
        <Select
          label={props.label !== false ? 'Team' : ''}
          value={selectedTeam}
          className={[classes.select, user === null && classes.hidden].filter(Boolean).join(' ')}
          initialValue={selectedTeam}
          disabled={user === null}
          onChange={option => {
            if (Array.isArray(option)) return
            setSelectedTeam(option)
          }}
          options={[...(allowEmpty ? [{ label: 'All teams', value: 'none' }] : []), ...options]}
          selectProps={{
            TeamDrawerToggler: (
              <TeamDrawerToggler className={classes.teamDrawerToggler}>
                Create new team
              </TeamDrawerToggler>
            ),
          }}
          components={{
            MenuList: SelectMenuButton,
          }}
          required={required}
        />
        {user === null && <LoadingShimmer heightPercent={100} className={classes.loading} />}
      </div>
      <TeamDrawer
        onCreate={newTeam => {
          teamToSelectAfterUserUpdates.current = newTeam.id
        }}
      />
    </Fragment>
  )
}
