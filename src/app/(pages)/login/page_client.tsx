'use client'

import React, { useCallback, useEffect, useState } from 'react'
import { cloudSlug } from '@cloud/slug'
import { Cell, Grid } from '@faceless-ui/css-grid'
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
import canUseDom from '@root/utilities/can-use-dom'

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
      <Grid>
        <Cell cols={5} colsM={8}>
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
        </Cell>
        <Cell cols={4} start={8} startM={1} colsM={8}>
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
        </Cell>
      </Grid>
    </Gutter>
  )
}
