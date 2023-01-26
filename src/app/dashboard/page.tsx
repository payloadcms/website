'use client'

import { Button } from '@components/Button'
import { Gutter } from '@components/Gutter'
import { Heading } from '@components/Heading'
import { useHeaderTheme } from '@root/providers/HeaderTheme'
import { getImplicitPreference } from '@root/providers/Theme/shared'
import { useAuthRedirect } from '@root/utilities/use-auth-redirect'
import React, { useEffect } from 'react'

const Dashboard: React.FC = () => {
  const { setHeaderColor } = useHeaderTheme()

  useEffect(() => {
    const implicitPreference = getImplicitPreference()
    setHeaderColor(implicitPreference ?? 'light')
  }, [])

  useAuthRedirect()

  return (
    <Gutter>
      <Heading marginTop={false}>Dashboard</Heading>
      <Button appearance="primary" label="logout" href="/logout" el="link" />
    </Gutter>
  )
}

export default Dashboard
