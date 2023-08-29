'use client'

import React, { useEffect, useRef, useState } from 'react'

import { Button } from '@components/Button'
import { Gutter } from '@components/Gutter'
import { Heading } from '@components/Heading'
import { useAuth } from '@root/providers/Auth'

import classes from './page.module.scss'

const threshold = 1000

export const Logout: React.FC = () => {
  const { user, logout } = useAuth()
  const [isLoggingOut, setLoggingOut] = useState(false)
  const [hasLoggedOut, setLoggedOut] = useState(false)
  const isRequesting = useRef(false)

  useEffect(() => {
    if (user && !isRequesting.current) {
      isRequesting.current = true

      const doLogout = async () => {
        setLoggingOut(true)

        try {
          const start = Date.now()

          await logout()

          const end = Date.now()
          const time = end - start
          const delay = threshold - time

          // give the illusion of a delay, so that the content doesn't blink on fast networks
          if (delay > 0) await new Promise(resolve => setTimeout(resolve, delay))

          setLoggingOut(false)
          setLoggedOut(true)
        } catch (e) {
          console.error(e) // eslint-disable-line no-console
        }

        isRequesting.current = false
      }

      doLogout()
    }
  }, [logout, user])

  if (user === null && hasLoggedOut) {
    return (
      <Gutter>
        <Heading as="h3" marginTop={false}>
          You have been logged out.
        </Heading>
        <p>What would you like to do next?</p>
        <div className={classes.controls}>
          <Button label="Log back in" href="/login" appearance="primary" el="link" />
          <Button label="Go home" href="/" appearance="secondary" el="link" />
        </div>
      </Gutter>
    )
  }

  if (user === null && !isLoggingOut && !hasLoggedOut) {
    return (
      <Gutter>
        <Heading as="h3" marginTop={false}>
          You are already logged out.
        </Heading>
        <div className={classes.controls}>
          <Button label="Log back in" href="/login" appearance="primary" el="link" />
          <Button label="Go home" href="/" appearance="secondary" el="link" />
        </div>
      </Gutter>
    )
  }

  return (
    <Gutter>
      <Heading as="h3" marginTop={false}>
        Logging out...
      </Heading>
      <p>Please wait while we log you out, this should only take a moment.</p>
    </Gutter>
  )
}
