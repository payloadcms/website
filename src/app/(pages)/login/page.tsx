'use client'

import React, { useCallback, useEffect, useState } from 'react'
import { Text } from '@forms/fields/Text'
import Form from '@forms/Form'
import Submit from '@forms/Submit'
import Link from 'next/link'
import { redirect, useSearchParams } from 'next/navigation'

import { Gutter } from '@components/Gutter'
import { Heading } from '@components/Heading'
import { BorderBox } from '@root/app/_components/BorderBox'
import { MaxWidth } from '@root/app/_components/MaxWidth'
import { cloudSlug } from '@root/app/cloud/layout'
import { useAuth } from '@root/providers/Auth'

import classes from './index.module.scss'

const Login: React.FC = () => {
  const searchParams = useSearchParams()
  const message = searchParams?.get('message')
  const { user, login } = useAuth()
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [redirectTo, setRedirectTo] = useState(`${cloudSlug}`)

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const redirectParam = params.get('redirect')
    if (redirectParam) {
      setRedirectTo(redirectParam)
    }
  }, [])

  const handleSubmit = useCallback(
    async ({ data }) => {
      const loadingTimer = setTimeout(() => {
        setLoading(true)
      }, 1000)

      try {
        const loggedInUser = await login({
          email: data.email as string,
          password: data.password as string,
        })

        clearTimeout(loadingTimer)

        if (!loggedInUser) {
          clearTimeout(loadingTimer)
          setLoading(false)
          setError('Invalid email or password')
        }
      } catch (err) {
        clearTimeout(loadingTimer)
        console.error(err) // eslint-disable-line no-console
        setLoading(false)
        setError('Invalid email or password')
      }
    },
    [login],
  )

  if (user === undefined) return null

  if (user) redirect(redirectTo)

  // const message = new URLSearchParams(window.location.search).get('message')

  return (
    <Gutter>
      <MaxWidth centered className={classes.maxWidth}>
        <Heading marginTop={false} element="h1" as="h3">
          Log in
        </Heading>
        {error && <div className={classes.error}>{error}</div>}
        {message && <div className={classes.message}>{message}</div>}

        <BorderBox className={classes.borderBox}>
          <Form onSubmit={handleSubmit} className={classes.form}>
            <Text path="email" label="Email" required elementAttributes={{ autoComplete: 'on' }} />
            <Text path="password" label="Password" type="password" required />
            <div>
              <Submit label="Log in" className={classes.submit} processing={loading} />
            </div>
          </Form>

          <div className={classes.formFooter}>
            <Link href="/forgot-password">Forgot your password?</Link>
            <div className={classes.leader}>
              {`Don't have an account? `}
              <Link href="/create-account">Register for free</Link>
              {'.'}
            </div>
          </div>
        </BorderBox>
      </MaxWidth>
    </Gutter>
  )
}

export default Login
