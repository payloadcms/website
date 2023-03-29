'use client'

import React, { useCallback } from 'react'
import { Text } from '@forms/fields/Text'
import Form from '@forms/Form'
import Submit from '@forms/Submit'
import { InitialState, OnSubmit } from '@forms/types'
import Link from 'next/link'

import { Button } from '@components/Button'
import { Gutter } from '@components/Gutter'
import { Heading } from '@components/Heading'
import { Highlight } from '@components/Highlight'
import { MaxWidth } from '@root/app/_components/MaxWidth'
import { useAuth } from '@root/providers/Auth'
import { FormWrap } from '@root/app/_components/FormWrap'

import classes from './index.module.scss'

const initialFormState: InitialState = {
  email: {
    value: '',
    valid: false,
    initialValue: undefined,
    errorMessage: 'Please enter a valid email address',
  },
}

const ForgotPassword: React.FC = () => {
  const { user, logout } = useAuth()

  const [error, setError] = React.useState<string | null>(null)
  const [successfullySubmitted, setSuccessfullySubmitted] = React.useState(false)

  const handleSubmit: OnSubmit = useCallback(
    async ({ data, dispatchFields }) => {
      try {
        const req = await fetch(`${process.env.NEXT_PUBLIC_CLOUD_CMS_URL}/api/graphql`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            query: `mutation {
              forgotPasswordUser(email: "${data.email}")
            }`,
          }),
        })

        const res = await req.json()

        if (res.errors) {
          setError(res.errors[0].message)
          return
        }

        dispatchFields({
          type: 'REPLACE_STATE',
          state: initialFormState,
        })

        setError(null)
        setSuccessfullySubmitted(true)
        return
      } catch (err) {
        setError(err.message)
      }

      setSuccessfullySubmitted(false)
    },
    [setError, setSuccessfullySubmitted],
  )

  if (user) {
    return (
      <Gutter>
        <MaxWidth size="medium" centered className={classes.maxWidth}>
            <Heading marginTop={false} element="h2" as="h2">
              <Highlight text="Hang on" appearance="danger" />
            </Heading>
            <Heading marginTop={false} element="p" as="h6">
              You are already logged in.
            </Heading>
            <div className={classes.buttonWrap}>
              <Button label="Log out" size="small" onClick={logout} appearance="primary" />
              <Button label="Dashboard" size="small" href="/cloud" appearance="secondary" />
            </div>
        </MaxWidth>
      </Gutter>
    )
  }

  return (
    <Gutter>
      {successfullySubmitted ? (
        <MaxWidth size="medium" centered className={classes.maxWidth}>
            <Heading marginTop={false} element="h2" as="h2">
              <Highlight text="Success" />
            </Heading>
            <Heading marginTop={false} element="p" as="h6">
              We have sent you an email with a link to reset your password. Please check your inbox.
            </Heading>
            <div className={classes.sidebar}>
              <div>
                {`Ready to login? `}
                <Link href="/login">Log in now</Link>
                {'.'}
              </div>
            </div>
        </MaxWidth>
      ) : (
        <MaxWidth centered className={classes.maxWidth}>
          <Heading marginTop={false} element="h1" as="h3">
            Forgot password
          </Heading>
          <FormWrap>
            <Form onSubmit={handleSubmit} className={classes.form} initialState={initialFormState}>
              {error && <div className={classes.error}>{error}</div>}
              <Text path="email" label="Email" required />
              <div>
                <Submit label="Recover" className={classes.submit} />
              </div>
            </Form>
              <div className={classes.sidebar}>
                {`Already have an account? `}
                <Link href="/login">Log in here</Link>.
              </div>
          </FormWrap>
        </MaxWidth>
      )}
    </Gutter>
  )
}

export default ForgotPassword
