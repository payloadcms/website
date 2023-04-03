'use client'

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

import { Button } from '@components/Button'
import { Gutter } from '@components/Gutter'
import { Heading } from '@components/Heading'
import { useAuth } from '@root/providers/Auth'

const Logout: React.FC = () => {
  const { user, logout } = useAuth()
  const [loggingOut, setLoggingOut] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const loadingTimer = setTimeout(() => {
      setLoggingOut(true)
    }, 1000)

    const initTimer = async () => {
      try {
        await logout()
        router.push('/cloud')
        clearTimeout(loadingTimer)
      } catch (e) {
        setLoggingOut(false)
      }
    }

    initTimer()

    return () => {
      clearTimeout(loadingTimer)
    }
  }, [logout, router])

  if (loggingOut && user)
    return (
      <Gutter>
        <Heading as="h3" marginTop={false}>
          Logging out...
        </Heading>
      </Gutter>
    )

  return (
    <Gutter>
      <Heading as="h3" marginTop={false}>
        Something went wrong, please try again.
      </Heading>
      <Button label="Logout" onClick={logout} appearance="primary" />
    </Gutter>
  )
}

export default Logout
