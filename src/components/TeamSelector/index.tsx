import React, { Fragment, useEffect } from 'react'
import { components } from 'react-select'
import { Select } from '@forms/fields/Select'
import Link from 'next/link'

import { Team } from '@root/payload-cloud-types'
import { useAuth } from '@root/providers/Auth'

import classes from './index.module.scss'

const SelectMenuButton = props => {
  const {
    selectProps: { selectProps },
  } = props

  return (
    <components.MenuList {...props}>
      {props.children}
      <Link className={classes.addTeamButton} href="/new/team" onClick={selectProps?.openPopup}>
        Create new team
      </Link>
    </components.MenuList>
  )
}

export const TeamSelector: React.FC<{
  value?: string
  onChange?: (value: Team) => void // eslint-disable-line no-unused-vars
}> = props => {
  const { user } = useAuth()

  const { onChange, value: valueFromProps } = props
  const hasInitializedSelection = React.useRef(false)
  const [selectedTeam, setSelectedTeam] = React.useState<Team | undefined>()

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
            ? [
                ...user?.teams?.map(({ team }) => ({
                  label: typeof team === 'string' ? team : team.name,
                  value: typeof team === 'string' ? team : team.id,
                })),
              ]
            : [
                {
                  label: 'No teams found',
                  value: 'no-teams',
                },
              ]),
        ]}
        components={{
          MenuList: SelectMenuButton,
        }}
      />
    </Fragment>
  )
}
