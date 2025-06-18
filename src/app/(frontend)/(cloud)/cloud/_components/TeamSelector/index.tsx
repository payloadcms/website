import type { Team, User } from '@root/payload-cloud-types'

import { useTeamDrawer } from '@cloud/_components/TeamDrawer/index'
import { LoadingShimmer } from '@components/LoadingShimmer/index'
import { Select } from '@forms/fields/Select/index'
import React, { Fragment, useEffect } from 'react'
import { components } from 'react-select'

import classes from './index.module.scss'

const SelectMenuButton = (props) => {
  const { children, TeamDrawerToggler } = props
  return (
    <components.MenuList {...props}>
      {children}
      {TeamDrawerToggler}
    </components.MenuList>
  )
}

export const TeamSelector: React.FC<{
  allowEmpty?: boolean
  className?: string
  enterpriseOnly?: boolean // used to filter out teams that are not enterprise
  initialValue?: string
  label?: false | string
  onChange?: (value?: Team) => void
  required?: boolean
  user?: null | User
  value?: string
}> = (props) => {
  const {
    allowEmpty,
    className,
    initialValue,
    onChange,
    required,
    user,
    value: valueFromProps,
  } = props

  const teams = user && user?.teams?.map(({ team }) => team)
  const [selectedTeam, setSelectedTeam] = React.useState<'none' | Team['id'] | undefined>(
    initialValue || 'none',
  )

  const prevSelectedTeam = React.useRef<'none' | Team['id'] | undefined>(selectedTeam)
  const teamToSelectAfterUserUpdates = React.useRef<string | undefined>(undefined)

  const [TeamDrawer, TeamDrawerToggler] = useTeamDrawer({
    team: teams?.find(
      (team) => typeof team === 'object' && team !== null && team.id === selectedTeam,
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
        (team) => typeof team === 'object' && team !== null && team.id === selectedTeam,
      ) as Team

      if (typeof onChange === 'function') {
        onChange(foundTeam)
      }
    }
  }, [onChange, selectedTeam, teams])

  useEffect(() => {
    if (user && teamToSelectAfterUserUpdates.current) {
      setSelectedTeam(teamToSelectAfterUserUpdates.current)
      teamToSelectAfterUserUpdates.current = undefined
    }
  }, [user])

  const options =
    Array.isArray(user?.teams) && user.teams.length > 0
      ? ([
          ...user.teams
            .map(({ team }) => {
              if (!team) {
                return null
              }
              if (props.enterpriseOnly && typeof team !== 'string' && team?.isEnterprise !== true) {
                return null
              }
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

  const valueNotFound = selectedTeam && !options.find((option) => option.value === selectedTeam)

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
          className={[classes.select, user === null && classes.hidden].filter(Boolean).join(' ')}
          components={{
            MenuList: (menuListProps) => (
              <SelectMenuButton
                {...menuListProps}
                TeamDrawerToggler={
                  <TeamDrawerToggler className={classes.teamDrawerToggler}>
                    Create new team
                  </TeamDrawerToggler>
                }
              />
            ),
          }}
          disabled={user === null}
          initialValue={selectedTeam}
          label={props.label !== false ? 'Team' : ''}
          onChange={(option) => {
            if (Array.isArray(option)) {
              return
            }
            setSelectedTeam(option)
          }}
          options={[...(allowEmpty ? [{ label: 'All teams', value: 'none' }] : []), ...options]}
          required={required}
          value={selectedTeam}
        />
        {user === null && <LoadingShimmer className={classes.loading} heightPercent={100} />}
      </div>
      <TeamDrawer
        onCreate={(newTeam) => {
          teamToSelectAfterUserUpdates.current = newTeam.id
        }}
      />
    </Fragment>
  )
}
