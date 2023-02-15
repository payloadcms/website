'use client'

import React from 'react'

import { Gutter } from '@components/Gutter'
import { useTeam } from './context'

export default () => {
  const team = useTeam()

  return (
    <Gutter>
      <h1>Manage your team: {team.name}</h1>
    </Gutter>
  )
}
