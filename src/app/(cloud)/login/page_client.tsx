'use client'

import React, { useCallback, useEffect, useState } from 'react'
import { cloudSlug } from '@cloud/slug'
import { Text } from '@forms/fields/Text'
import Form from '@forms/Form'
import FormProcessing from '@forms/FormProcessing'
import FormSubmissionError from '@forms/FormSubmissionError'
import Submit from '@forms/Submit'
import { InitialState } from '@forms/types'
import Link from 'next/link'
import { redirect, useSearchParams } from 'next/navigation'

import { Gutter } from '@components/Gutter'
import { Heading } from '@components/Heading'
import { RenderParams } from '@root/app/_components/RenderParams'
import { useAuth } from '@root/providers/Auth'

import classes from './page.module.scss'

const initialFormState: InitialState = {
  email: {
    value: '',
    valid: false,
    initialValue: '',
    errorMessage: 'Please enter a valid email address',
  },
  password: {
    value: '',
    valid: false,
    initialValue: '',
    errorMessage: 'Please enter a password',
  },
}

export const Login: React.FC = () => {
  const searchParams = useSearchParams()
  const { user, login } = useAuth()
  const [redirectTo, setRedirectTo] = useState(cloudSlug)

  const trustedRoutes = ['/'] // .. add more routes or external links

  useEffect(() => {
    const redirectParam = searchParams?.get('redirect')
    if (redirectParam) {
      // Check if the provided 'redirectParam' is among the trusted routes
      const isTrustedRoute = trustedRoutes.includes(redirectParam)

      // If the 'redirectParam' is trusted, update the redirection target
      if (isTrustedRoute) {
        setRedirectTo(redirectParam)
      }

      // If the 'redirectParam' is not trusted, redirect to the default 'cloudSlug'
      else {
        setRedirectTo(cloudSlug)
      }
    }
  }, [searchParams])

  const handleSubmit = useCallback(
    async ({ data }) => {
      setTimeout(() => {
        window.scrollTo(0, 0)
      }, 0)

      try {
        const loggedInUser = await login({
          email: data.email as string,
          password: data.password as string,
        })

        if (!loggedInUser) {
          throw new Error(`Invalid email or password`)
        }
      } catch (err) {
        console.error(err) // eslint-disable-line no-console
        throw new Error(`Invalid email or password`)
      }
    },
    [login],
  )

  if (user === undefined) return null

  if (user) redirect(redirectTo)

  return (
    <Gutter>
      <RenderParams />
      <Heading marginTop={false} element="h1">
        Log in
      </Heading>
      <div className={['grid'].filter(Boolean).join(' ')}>
        <div className={['cols-6 cols-m-8'].filter(Boolean).join(' ')}>
          <Form onSubmit={handleSubmit} className={classes.form} initialState={initialFormState}>
            <FormSubmissionError />
            <FormProcessing message="Logging in, one moment..." />
            <Text
              path="email"
              label="Email"
              required
              elementAttributes={{ autoComplete: 'on' }}
              initialValue={searchParams?.get('email') || undefined}
            />
            <Text path="password" label="Password" type="password" required />
            <div>
              <Submit label="Log in" className={classes.submit} />
            </div>
          </Form>
        </div>
        <div
          className={[classes.sidebarWrap, 'cols-6 start-10 cols-m-8 start-m-1']
            .filter(Boolean)
            .join(' ')}
        >
          <div className={classes.sidebar}>
            <p>
              {`Don't have an account? `}
              <Link href={`/signup${redirectTo ? `?redirect=${redirectTo}` : ''}`}>
                Register for free
              </Link>
              {'.'}
            </p>
            <p>
              {`Forgot your password? `}
              <Link href={`/forgot-password${redirectTo ? `?redirect=${redirectTo}` : ''}`}>
                Reset it here
              </Link>
              {'.'}
            </p>
          </div>
        </div>
      </div>
    </Gutter>
  )
}
