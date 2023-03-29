'use client'

import React, { useEffect, useState } from 'react'

import { Gutter } from '@components/Gutter'
import { Heading } from '@components/Heading'
import { useAuth } from '@root/providers/Auth'
import { Button } from '@components/Button'

import classes from './index.module.scss'

const Logout: React.FC = () => {
  const { user, logout } = useAuth()
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const loadingTimer = setTimeout(() => {
      setLoading(true)
    }, 1000)

    const initTimer = async () => {
      await logout()
      clearTimeout(loadingTimer)
      setLoading(false)
    }

    initTimer()

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
      <Heading as="h3" marginTop={false}>You have been logged out</Heading>
      <div className={classes.buttonWrap}> 
        <Button label="Return to Homepage" size="small"  href="/" appearance="primary" />
        <Button label="Return to Login" size="small" href="/login" appearance="secondary" />
      </div>
     </Gutter>
  )
}

export default Logout
