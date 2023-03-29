'use client'

import React, { useCallback, useState } from 'react'
import Link from 'next/link'

import { Button } from '@components/Button'
import { Gutter } from '@components/Gutter'
import { Heading } from '@components/Heading'
import { Highlight } from '@components/Highlight'
import { Text } from '@forms/fields/Text'
import Form from '@forms/Form'
import Submit from '@forms/Submit'
import { InitialState, OnSubmit } from '@forms/types'
import { FormWrap } from '@root/app/_components/FormWrap'
import { MaxWidth } from '@root/app/_components/MaxWidth'
import { useAuth } from '@root/providers/Auth'

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
  passwordConfirm: {
    value: '',
    valid: false,
    initialValue: undefined,
    errorMessage: 'Please confirm your password',
  },
}

const CreateAccount: React.FC = () => {
  const { user, logout } = useAuth()
  const [error, setError] = React.useState<{
    message: string
    name: string
    data: {
      message: string
      field: string
    }[]
  }>()
  const [successfullySubmitted, setSuccessfullySubmitted] = useState(false)

  const createAccount: OnSubmit = useCallback(async ({ data, dispatchFields }) => {
    if (data.password !== data.passwordConfirm) {
      dispatchFields({
        type: 'UPDATE',
        path: 'passwordConfirm',
        errorMessage: 'Passwords do not match',
        valid: false,
        value: data.passwordConfirm,
      })
      dispatchFields({
        type: 'UPDATE',
        path: 'password',
        errorMessage: 'Passwords do not match',
        valid: false,
        value: data.password,
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
            createUser(data: { email: "${data.email}", password: "${data.password}" }) {
              email
            }
          }`,
        }),
      })

      if (req.ok) {
        const res = await req.json()

        if (!res.errors) {
          // reset form
          dispatchFields({
            type: 'REPLACE_STATE',
            state: initialFormState,
          })
          setSuccessfullySubmitted(true)
        } else if (res?.errors?.length > 0) {
          setError(res?.errors?.[0]?.extensions)
          return
        } else {
          throw new Error('An unknown error occurred. Please try again.')
        }
      } else {
        throw new Error(
          'Unable to create an account. One may already exist with this email address. Please try again.',
        )
      }
    } catch (e) {
      console.log('caught error', e)
      setError(e.message)
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
            <Heading marginTop={false} element="h2" as="h2">
              <Highlight text="Success" />
            </Heading>
            <Heading marginTop={false} element="p" as="h6">
              Your account has been created! Please check your email to verify your account.
            </Heading>

            <div className={classes.formFooter}>
              {`Already verified your account? `}
              <Link href="/login">Log in now</Link>
              {'.'}
            </div>
        </MaxWidth>
      ) : (
        <MaxWidth centered className={classes.maxWidth}>
          <Heading marginTop={false} element="h1" as="h2">
            Create an account
          </Heading>

          <FormWrap>
            <Form
              onSubmit={createAccount}
              className={classes.form}
              initialState={initialFormState}
              errors={error?.data}
            >
              <Text path="email" label="Email" required />
              <Text path="password" label="Password" type="password" required />
              <Text path="passwordConfirm" label="Confirm Password" type="password" required />
              <div>
                <Submit label="Create Account" className={classes.submit} />
              </div>
            </Form>

            <div>
              {`Already have an account? `}
              <Link href="/login">Log in now</Link>
              {'.'}
            </div>
          </FormWrap>
        </MaxWidth>
      )}
    </Gutter>
  )
}

export default CreateAccount
