'use client'

import React, { useEffect } from 'react'

import { Button } from '@components/Button'
import { Gutter } from '@components/Gutter'
import { Heading } from '@components/Heading'
import { useAuth } from '@root/providers/Auth'
import { useHeaderTheme } from '@root/providers/HeaderTheme'
import { getImplicitPreference } from '@root/providers/Theme/shared'

const Dashboard: React.FC = () => {
  const { setHeaderColor } = useHeaderTheme()
  const { user } = useAuth()

  useEffect(() => {
    const implicitPreference = getImplicitPreference()
    setHeaderColor(implicitPreference ?? 'light')
  }, [])

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
