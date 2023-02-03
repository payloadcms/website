'use client'

import React, { Fragment, useCallback, useEffect, useState } from 'react'
import { Text } from '@forms/fields/Text'
import Form from '@forms/Form'
import Submit from '@forms/Submit'
import { Data } from '@forms/types'
import Link from 'next/link'
import { redirect } from 'next/navigation'

import { Button } from '@components/Button'
import { Gutter } from '@components/Gutter'
import { Heading } from '@components/Heading'
import { ArrowIcon } from '@root/icons/ArrowIcon'
import { useAuth } from '@root/providers/Auth'
import { useHeaderTheme } from '@root/providers/HeaderTheme'
import { getImplicitPreference } from '@root/providers/Theme/shared'

import classes from './index.module.scss'

const Login: React.FC = () => {
  const { user, login } = useAuth()
  const { setHeaderColor } = useHeaderTheme()
  const [loading, setLoading] = useState(false)
  const [showForm, setShowForm] = useState(false)

  useEffect(() => {
    const implicitPreference = getImplicitPreference()
    setHeaderColor(implicitPreference ?? 'light')
  }, [])

  const handleSubmit = useCallback(
    async (data: Data) => {
      const loadingTimer = setTimeout(() => {
        setLoading(true)
      }, 1000)

      const loggedInUser = await login({
        email: data.email as string,
        password: data.password as string,
      })

      clearTimeout(loadingTimer)

      if (loggedInUser) {
        redirect('/dashboard')
      }
    },
    [login],
  )

  if (user) redirect('/dashboard')

  if (user === undefined) return null

  if (loading)
    return (
      <Gutter>
        <div>Logging in...</div>
      </Gutter>
    )

  return (
    <Gutter>
      <Heading marginTop={false}>Log in</Heading>
      {!showForm && (
        <Fragment>
          <Button
            label="Log in with GitHub"
            appearance="primary"
            el="link"
            href={`https://github.com/login/oauth/authorize?client_id=${process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID}&redirect_uri=${process.env.NEXT_PUBLIC_GITHUB_REDIRECT_URI}`}
            icon="github"
          />
          <button
            type="button"
            onClick={() => setShowForm(true)}
            className={classes.changeLoginMethod}
          >
            {`Continue with email `}
            <ArrowIcon />
          </button>
        </Fragment>
      )}
      {showForm && (
        <Fragment>
          <button
            type="button"
            onClick={() => setShowForm(false)}
            className={classes.changeLoginMethod}
          >
            <ArrowIcon />
            {` Other Login Options`}
          </button>
          <div className={classes.leader}>
            {`Don't have an account? `}
            <Link href="/create-account">Register for free</Link>
            {'.'}
          </div>
          <Form onSubmit={handleSubmit} className={classes.form}>
            <Text path="email" label="Email" required />
            <Text path="password" label="Password" type="password" required />
            <Submit label="Log in" className={classes.submit} />
          </Form>
          <Link href="/recover-password">Forgot your password?</Link>
        </Fragment>
      )}
    </Gutter>
  )
}

export default Login
