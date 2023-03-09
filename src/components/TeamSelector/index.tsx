import React, { Fragment, useEffect } from 'react'
import { components } from 'react-select'
import { Select } from '@forms/fields/Select'

import { useTeamDrawer } from '@components/TeamDrawer'
import { Team } from '@root/payload-types copy'
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
  onChange?: (value?: Team) => void // eslint-disable-line no-unused-vars
  className?: string
}> = props => {
  const { user } = useAuth()

  const { onChange, value: valueFromProps, className } = props
  const hasInitializedSelection = React.useRef(false)
  const [selectedTeam, setSelectedTeam] = React.useState<Team | undefined>()
  const [TeamDrawer, TeamDrawerToggler] = useTeamDrawer({ team: selectedTeam })

  useEffect(() => {
    if (user) {
      if (valueFromProps === selectedTeam?.id && user?.teams?.length) {
        const newSelection = user.teams?.find(team => team.id === valueFromProps)?.team as Team
        setSelectedTeam(newSelection)
      }
    }
  }, [valueFromProps, user, selectedTeam])

  useEffect(() => {
    if (user) {
      if (user?.teams?.length && !hasInitializedSelection.current) {
        hasInitializedSelection.current = true
        setSelectedTeam(user.teams?.[0]?.team as Team)
      }
    }
  }, [user])

  useEffect(() => {
    if (typeof onChange === 'function') {
      onChange(selectedTeam)
    }
  }, [onChange, selectedTeam])

  if (!user) return null

  return (
    <Fragment>
      <Select
        className={className}
        label="Team"
        value={selectedTeam?.id}
        initialValue={
          typeof user?.teams?.[0]?.team === 'string'
            ? user?.teams?.[0]?.team
            : user?.teams?.[0]?.team.id
        }
        onChange={option => {
          if (Array.isArray(option)) return
          setSelectedTeam(
            user?.teams?.find(({ team }) => typeof team === 'object' && team.id === option.value)
              ?.team as Team,
          )
        }}
        options={[
          ...(user.teams && user.teams?.length > 0
            ? ([
                ...user?.teams?.map(({ team }) => ({
                  label: typeof team === 'string' ? team : team.name,
                  value: typeof team === 'string' ? team : team.id,
                })),
              ] as any)
            : [
                {
                  label: 'No teams found',
                  value: 'no-teams',
                },
              ]),
        ]}
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
      <TeamDrawer />
    </Fragment>
  )
}
