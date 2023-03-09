import React, { useCallback } from 'react'
import { useModal } from '@faceless-ui/modal'
import Form from '@forms/Form'
import Submit from '@forms/Submit'

import { Team } from '@root/payload-types copy'
import { TeamDrawerProps } from './types'

export const TeamDrawerContent: React.FC<TeamDrawerProps> = ({ drawerSlug, onCreate }) => {
  const handleSubmit = useCallback(
    data => {
      const newTeam: Team = data
      if (typeof onCreate === 'function') onCreate(newTeam)
    },
    [onCreate],
  )

  const { modalState } = useModal()

  const isOpen = modalState[drawerSlug]?.isOpen

  if (!isOpen) return null

  return (
    <div className="list-drawer__content">
      <Form onSubmit={handleSubmit}>
        <Submit label="Create Team" />
      </Form>
    </div>
  )
}
