'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'

import { Gutter } from '@components/Gutter'
import { Heading } from '@components/Heading'
import { useAuth } from '@root/providers/Auth'
import { useHeaderTheme } from '@root/providers/HeaderTheme'
import { getImplicitPreference } from '@root/providers/Theme/shared'

const Logout: React.FC = () => {
  const { user, logout } = useAuth()
  const { setHeaderColor } = useHeaderTheme()
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const implicitPreference = getImplicitPreference()
    setHeaderColor(implicitPreference ?? 'light')
  }, [])

  useEffect(() => {
    const loadingTimer = setTimeout(() => {
      setLoading(true)
    }, 1000)
    ;(async () => {
      await logout()
      clearTimeout(loadingTimer)
      setLoading(false)
    })()

    return () => {
      clearTimeout(loadingTimer)
    }
  }, [logout])

  if (loading)
    return (
      <Gutter>
        <div>Logging out...</div>
      </Gutter>
    )

  if (!loading && user)
    return (
      <Gutter>
        <div>Something went wrong, please try again.</div>
      </Gutter>
    )

  return (
    <Gutter>
      <Heading marginTop={false}>You have been logged out</Heading>
      <p>
        {'What you like to do next? Go to the '}
        <Link href="/login">home page</Link>
        {' or '}
        <Link href="/login">log back in</Link>
        {'.'}
      </p>
    </Gutter>
  )
}

export default Logout
