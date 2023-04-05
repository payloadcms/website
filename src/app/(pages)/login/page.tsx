'use client'

import React, { useCallback, useEffect, useState } from 'react'
import { Cell, Grid } from '@faceless-ui/css-grid'
import { Text } from '@forms/fields/Text'
import Form from '@forms/Form'
import Submit from '@forms/Submit'
import { InitialState } from '@forms/types'
import Link from 'next/link'
import { redirect, useSearchParams } from 'next/navigation'

import { Gutter } from '@components/Gutter'
import { Heading } from '@components/Heading'
import { Message } from '@components/Message'
import { cloudSlug } from '@root/app/cloud/client_layout'
import { useAuth } from '@root/providers/Auth'
import canUseDom from '@root/utilities/can-use-dom'

import classes from './index.module.scss'

const initialFormState: InitialState = {
  email: {
    value: '',
    valid: false,
    initialValue: undefined,
    errorMessage: 'Please enter a valid email address',
  },
  password: {
    value: '',
    valid: false,
    initialValue: undefined,
    errorMessage: 'Please enter a password',
  },
}

const Login: React.FC = () => {
  const searchParams = useSearchParams()
  const successParam = searchParams?.get('success')
  const errorParam = searchParams?.get('error')
  const warningParam = searchParams?.get('warning')

  const { user, login } = useAuth()
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [redirectTo, setRedirectTo] = useState(`${cloudSlug}`)

  useEffect(() => {
    const redirectParam = searchParams?.get('redirect')
    if (redirectParam) {
      setRedirectTo(redirectParam)
    }
  }, [searchParams])

  const handleSubmit = useCallback(
    async ({ data }) => {
      setTimeout(() => {
        window.scrollTo(0, 0)
      }, 0)

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

  return (
    <Gutter>
      <Heading marginTop={false} element="h1">
        Log in
      </Heading>
      <Grid>
        <Cell cols={5} colsM={8}>
          <Message error={errorParam} success={successParam} warning={warningParam} />
          <Form onSubmit={handleSubmit} className={classes.form} initialState={initialFormState}>
            {error && <div className={classes.error}>{error}</div>}
            <Text
              path="email"
              label="Email"
              required
              elementAttributes={{ autoComplete: 'on' }}
              initialValue={searchParams?.get('email') || undefined}
            />
            <Text path="password" label="Password" type="password" required />
            <div>
              <Submit label="Log in" className={classes.submit} processing={loading} />
            </div>
          </Form>
        </Cell>
        <Cell cols={4} start={8} startM={1} colsM={8}>
          <div className={classes.sidebar}>
            <p>
              {`Don't have an account? `}
              <Link href={`/signup${canUseDom ? window.location.search : ''}`}>
                Register for free
              </Link>
              {'.'}
            </p>
            <p>
              {`Forgot your password? `}
              <Link href={`/forgot-password${canUseDom ? window.location.search : ''}`}>
                Reset it here
              </Link>
              {'.'}
            </p>
          </div>
        </Cell>
      </Grid>
    </Gutter>
  )
}

export default Login
