'use client'

import React, { useCallback, useEffect, useState } from 'react'
import { Text } from '@forms/fields/Text'
import Form from '@forms/Form'
import Submit from '@forms/Submit'
import { InitialState } from '@forms/types'
import Link from 'next/link'
import { redirect, useSearchParams } from 'next/navigation'

import { Gutter } from '@components/Gutter'
import { Heading } from '@components/Heading'
import { BorderBox } from '@root/app/_components/BorderBox'
import { FormWrap } from '@root/app/_components/FormWrap'
import { MaxWidth } from '@root/app/_components/MaxWidth'
import { cloudSlug } from '@root/app/cloud/layout'
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
  const message = searchParams?.get('message')
  const { user, login } = useAuth()
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [redirectTo, setRedirectTo] = useState(`${cloudSlug}`)
  const [search] = React.useState<string | null>(() => (canUseDom ? window.location.search : null))

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
      <MaxWidth centered className={classes.maxWidth}>
        <Heading marginTop={false} element="h1" as="h2">
          Log in
        </Heading>
        {message && <p className={classes.message}>{message}</p>}
        <FormWrap>
          <Form onSubmit={handleSubmit} className={classes.form} initialState={initialFormState}>
            {error && <div className={classes.error}>{error}</div>}
            <Text path="email" label="Email" required elementAttributes={{ autoComplete: 'on' }} />
            <Text path="password" label="Password" type="password" required />
            <div>
              <Submit label="Log in" className={classes.submit} processing={loading} />
            </div>
          </Form>
          <div className={classes.sidebar}>
            <Link href={`/forgot-password${search}`}>Forgot your password?</Link>
            <div className={classes.leader}>
              {`Don't have an account? `}
              <Link href={`/signup${search}`}>Register for free</Link>
              {'.'}
            </div>
          </div>
        </FormWrap>
      </MaxWidth>
    </Gutter>
  )
}

export default Login
