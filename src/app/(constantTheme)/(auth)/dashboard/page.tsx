'use client'

import React from 'react'

import { Button } from '@components/Button'
import { Gutter } from '@components/Gutter'
import { Heading } from '@components/Heading'
import { useAuth } from '@root/providers/Auth'
import { useAuthRedirect } from '@root/utilities/use-auth-redirect'

const Dashboard: React.FC = () => {
  const { user } = useAuth()

  useAuthRedirect()

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
