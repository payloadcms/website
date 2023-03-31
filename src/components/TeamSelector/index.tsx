import React, { Fragment, useEffect } from 'react'
import { components } from 'react-select'
import { Select } from '@forms/fields/Select'

import { useTeamDrawer } from '@components/TeamDrawer'
import { Team } from '@root/payload-cloud-types'
import { useAuth } from '@root/providers/Auth'

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
  onChange?: (value?: string) => void // eslint-disable-line no-unused-vars
  className?: string
  allowEmpty?: boolean
  initialValue?: string
}> = props => {
  const { onChange, value: valueFromProps, className, allowEmpty, initialValue } = props
  const { user } = useAuth()
  const teams = user?.teams?.map(({ team }) => team)
  const [selectedTeam, setSelectedTeam] = React.useState<string | undefined>(initialValue)

  const [TeamDrawer, TeamDrawerToggler] = useTeamDrawer({
    team: teams?.find(team => typeof team === 'object' && team?.id === selectedTeam) as Team,
  })

  // allow external control of the selection
  useEffect(() => {
    if (valueFromProps === selectedTeam) {
      setSelectedTeam(valueFromProps)
    }
  }, [valueFromProps, selectedTeam])

  // report the selection to the parent
  useEffect(() => {
    if (typeof onChange === 'function') {
      onChange(selectedTeam)
    }
  }, [onChange, selectedTeam])

  if (!user) return null

  const options = (
    user.teams && user.teams?.length > 0
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
      label: `Team ${selectedTeam} (non-member)`,
      value: selectedTeam,
    })
  }

  return (
    <Fragment>
      <Select
        className={className}
        label="Team"
        value={selectedTeam}
        initialValue={selectedTeam}
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
      />
      <TeamDrawer
        onCreate={team => {
          setSelectedTeam(team.id)
        }}
      />
    </Fragment>
  )
}
