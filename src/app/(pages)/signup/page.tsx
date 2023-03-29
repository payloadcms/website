'use client'

import React, { useCallback, useState } from 'react'
import { Text } from '@forms/fields/Text'
import Form from '@forms/Form'
import Submit from '@forms/Submit'
import { InitialState, OnSubmit } from '@forms/types'
import Link from 'next/link'

import { Button } from '@components/Button'
import { Gutter } from '@components/Gutter'
import { Heading } from '@components/Heading'
import { Highlight } from '@components/Highlight'
import { UniqueTeamSlug } from '@components/UniqueSlug'
import { BorderBox } from '@root/app/_components/BorderBox'
import { MaxWidth } from '@root/app/_components/MaxWidth'
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
  createTeamFromName: {
    value: 'My Team',
    valid: false,
    initialValue: 'My Team',
    errorMessage: 'Please enter a team name',
  },
  createTeamFromSlug: {
    value: '',
    valid: false,
    initialValue: undefined,
    errorMessage: 'Please enter a team slug',
  },
  password: {
    value: '',
    valid: false,
    initialValue: undefined,
    errorMessage: 'Please enter a password',
  },
  passwordConfirm: {
    value: '',
    valid: false,
    initialValue: undefined,
    errorMessage: 'Please confirm your password',
  },
}

const Signup: React.FC = () => {
  const { user, logout } = useAuth()

  const [error, setError] = React.useState<string | null>(null)

  const [successfullySubmitted, setSuccessfullySubmitted] = useState(false)
  const [search] = React.useState<string | null>(() => (canUseDom ? window.location.search : null))

  const createAccount: OnSubmit = useCallback(async ({ data: formData, dispatchFields }) => {
    setTimeout(() => {
      window.scrollTo(0, 0)
    }, 0)

    if (formData.password !== formData.passwordConfirm) {
      dispatchFields({
        type: 'UPDATE',
        path: 'passwordConfirm',
        errorMessage: 'Passwords do not match',
        valid: false,
        value: formData.passwordConfirm,
      })
      dispatchFields({
        type: 'UPDATE',
        path: 'password',
        errorMessage: 'Passwords do not match',
        valid: false,
        value: formData.password,
      })
      return
    }

    try {
      const req = await fetch(`${process.env.NEXT_PUBLIC_CLOUD_CMS_URL}/api/graphql`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: `mutation {
            createUser(data: { email: "${formData.email}", password: "${formData.password}", createTeamFromName: "${formData.createTeamFromName}", createTeamFromSlug: "${formData.createTeamFromSlug}" }) {
               email
            }
          }`,
        }),
      })

      const { data, errors } = await req.json()

      if (req.ok) {
        if (errors) {
          throw new Error(errors[0].message)
        }

        if (!data?.createUser) {
          throw new Error('An error occurred')
        }

        setSuccessfullySubmitted(true)
      } else {
        throw new Error(errors?.[0]?.message)
      }
    } catch (e) {
      console.error(e) // eslint-disable-line no-console
      setError(e?.message || 'An error occurred')
    }
  }, [])

  if (user) {
    return (
      <Gutter>
        <h1>You are already logged in.</h1>
        <Button label="Log out" onClick={logout} appearance="primary" />
      </Gutter>
    )
  }

  return (
    <Gutter>
      {successfullySubmitted ? (
        <MaxWidth size="medium" centered className={classes.maxWidth}>
          <BorderBox padding="large">
            <Heading marginTop={false} element="h2" as="h5">
              <Highlight text="Success" />
            </Heading>
            <Heading marginTop={false} element="p" as="h6">
              Your account was created! Please check your email to verify your account and login.
            </Heading>
            <div className={classes.formFooter}>
              {`Already verified your account? `}
              <Link href={`/login${search}`}>Log in now</Link>
              {'.'}
            </div>
          </BorderBox>
        </MaxWidth>
      ) : (
        <MaxWidth centered className={classes.maxWidth}>
          <Heading marginTop={false} element="h1" as="h3">
            Sign up for Payload Cloud
          </Heading>
          <BorderBox className={classes.borderBox} padding="large">
            {error && <div className={classes.error}>{error}</div>}
            <Form onSubmit={createAccount} className={classes.form} initialState={initialFormState}>
              <Text path="email" label="Email" required />
              <Text path="createTeamFromName" label="Team Name" required />
              <UniqueTeamSlug path="createTeamFromSlug" />
              <Text path="password" label="Password" type="password" required />
              <Text path="passwordConfirm" label="Confirm Password" type="password" required />
              <div>
                <Submit label="Signup" className={classes.submit} />
              </div>
            </Form>
            <div className={classes.formFooter}>
              {`Already have an account? `}
              <Link href={`/login${search}`}>Log in now</Link>
              {'.'}
            </div>
          </BorderBox>
        </MaxWidth>
      )}
    </Gutter>
  )
}

export default Signup
