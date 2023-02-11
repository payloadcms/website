'use client'

import React from 'react'

import { Button } from '@components/Button'
import { Gutter } from '@components/Gutter'
import { Heading } from '@components/Heading'
import { useAuth } from '@root/providers/Auth'

const Dashboard: React.FC = () => {
  const { user } = useAuth()

  // TODO: redirect to team page (personal team), that screen should be responsible for showing "create new" / "existing projects"

  return (
    <Gutter>
      <Heading marginTop={false}>Dashboard</Heading>
      <p>{`Email: ${user?.email}`}</p>
      <Button appearance="primary" label="New project" href="/new" el="link" />
      <br />
      <br />
      <Button appearance="secondary" label="Logout" href="/logout" el="link" />
    </Gutter>
  )
}

export default Dashboard
