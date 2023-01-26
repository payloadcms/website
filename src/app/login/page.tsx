'use client'

import { Gutter } from '@components/Gutter'
import { Text } from '@forms/fields/Text'
import Form from '@forms/Form'
import Submit from '@forms/Submit'
import { Data } from '@forms/types'
import { useAuth } from '@root/providers/Auth'
import Link from 'next/link'
import React, { useCallback, useEffect, useState } from 'react'
import { getImplicitPreference } from '@root/providers/Theme/shared'
import { useHeaderTheme } from '@root/providers/HeaderTheme'
import { redirect } from 'next/navigation'

import { Heading } from '@components/Heading'
import classes from './index.module.scss'

const Login: React.FC = () => {
  const { user, login } = useAuth()
  const { setHeaderColor } = useHeaderTheme()
  const [loading, setLoading] = useState(false)

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
    </Gutter>
  )
}

export default Login
