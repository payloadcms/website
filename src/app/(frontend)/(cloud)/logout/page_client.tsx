'use client'

import { Button } from '@components/Button/index'
import { Gutter } from '@components/Gutter/index'
import { useAuth } from '@root/providers/Auth/index'
import React, { useEffect, useRef, useState } from 'react'

import classes from './page.module.scss'

const threshold = 1000

export const Logout: React.FC = () => {
  const { logout, user } = useAuth()
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
          if (delay > 0) {
            await new Promise((resolve) => setTimeout(resolve, delay))
          }

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
        <h3>You have been logged out.</h3>
        <p>What would you like to do next?</p>
        <div className={classes.controls}>
          <Button appearance="primary" el="link" href="/login" label="Log back in" />
          <Button appearance="secondary" el="link" href="/" label="Go home" />
        </div>
      </Gutter>
    )
  }

  if (user === null && !isLoggingOut && !hasLoggedOut) {
    return (
      <Gutter>
        <h3>You are already logged out.</h3>
        <div className={classes.controls}>
          <Button appearance="primary" el="link" href="/login" label="Log back in" />
          <Button appearance="secondary" el="link" href="/" label="Go home" />
        </div>
      </Gutter>
    )
  }

  return (
    <Gutter>
      <h3>Logging out...</h3>
      <p>Please wait while we log you out, this should only take a moment.</p>
    </Gutter>
  )
}
