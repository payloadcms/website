'use client'

import React, { useCallback, useState } from 'react'
import { Text } from '@forms/fields/Text'
import Form from '@forms/Form'
import FormProcessing from '@forms/FormProcessing'
import FormSubmissionError from '@forms/FormSubmissionError'
import Submit from '@forms/Submit'
import { InitialState, OnSubmit } from '@forms/types'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'

import { Button } from '@components/Button'
import { Gutter } from '@components/Gutter'
import { Heading } from '@components/Heading'
import { Highlight } from '@components/Highlight'
import { useAuth } from '@root/providers/Auth'
import canUseDom from '@root/utilities/can-use-dom'
import { getCookie } from '@root/utilities/get-cookie'

import classes from './page.module.scss'

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

export const Signup: React.FC = () => {
  const searchParams = useSearchParams()
  const { user } = useAuth()

  const [successfullySubmitted, setSuccessfullySubmitted] = useState(false)

  const createAccount: OnSubmit = useCallback(async ({ data: formData, dispatchFields }) => {
    setTimeout(() => {
      window.scrollTo(0, 0)
    }, 0)

    if (formData.password !== formData.passwordConfirm) {
      dispatchFields({
        type: 'UPDATE',
        payload: [
          {
            path: 'passwordConfirm',
            errorMessage: 'Passwords do not match',
            valid: false,
            value: formData.passwordConfirm,
          },
          {
            path: 'password',
            errorMessage: 'Passwords do not match',
            valid: false,
            value: formData.password,
          },
        ],
      })

      return
    }

    try {
      const hubspotCookie = getCookie('hubspotutk')
      const pageUri = `${process.env.NEXT_PUBLIC_SITE_URL}/signup`
      const pageName = 'Cloud Sign Up'
      const req = await fetch(
        `${process.env.NEXT_PUBLIC_CLOUD_CMS_URL}/api/graphql${
          formData?.redirect ? `?redirect=${formData.redirect}` : ''
        }`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            query: `mutation {
            createUser(data: { email: "${formData.email}", password: "${formData.password}"}) {
              email
            }
          }`,
            hubspotCookie,
            pageUri,
            pageName,
          }),
        },
      )

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
      throw new Error(e.message)
    }
  }, [])

  const redirectParam = searchParams?.get('redirect')

  if (user) {
    return (
      <Gutter>
        <div className={['grid'].filter(Boolean).join(' ')}>
          <div className={['cols-5 cols-m-8'].filter(Boolean).join(' ')}>
            <Heading marginTop={false} element="h2" as="h2">
              <Highlight text="Already logged in" appearance="success" />
            </Heading>
            <Heading marginTop={false} element="p" as="h4">
              You must first logout to create another account.
            </Heading>
            <div className={classes.buttonWrap}>
              <Button label="Log out" href="/logout" appearance="primary" el="link" />
              <Button label="Dashboard" href="/cloud" appearance="secondary" el="link" />
            </div>
          </div>
        </div>
      </Gutter>
    )
  }

  if (successfullySubmitted) {
    return (
      <Gutter>
        <Heading marginTop={false} element="h2" as="h2">
          <Highlight text="Verify your account" />
        </Heading>
        <div className={['grid'].filter(Boolean).join(' ')}>
          <div className={['cols-5 cols-m-8'].filter(Boolean).join(' ')}>
            <Heading marginTop={false} element="p" as="h4">
              Your account has been created. Please check your email to verify your account and
              login.
            </Heading>
            <div className={classes.links}>
              <p>
                {`Already verified your account? `}
                <Link href={`/login${canUseDom ? window.location.search : ''}`}>Log in now</Link>
                {'.'}
              </p>
            </div>
          </div>
        </div>
      </Gutter>
    )
  }

  return (
    <Gutter>
      <Heading marginTop={false} element="h1">
        Create an account
      </Heading>
      <div className={['grid'].filter(Boolean).join(' ')}>
        <div className={['cols-5 cols-m-8'].filter(Boolean).join(' ')}>
          <div className={classes.links}>
            {`Already have an account? `}
            <Link href={`/login${redirectParam ? `?redirect=${redirectParam}` : ''}`}>
              Log in now
            </Link>
            {'.'}
          </div>
          <Form
            onSubmit={createAccount}
            className={classes.form}
            initialState={initialFormState}
            formId={'payload_cloud_sign_up'}
          >
            <FormSubmissionError />
            <FormProcessing message="Signing up, one moment..." />
            <Text
              path="email"
              label="Email"
              required
              initialValue={searchParams?.get('email') || undefined}
            />
            <Text path="password" label="Password" type="password" required />
            <Text path="passwordConfirm" label="Confirm Password" type="password" required />
            {typeof redirectParam === 'string' && (
              <Text path="redirect" type="hidden" value={redirectParam} />
            )}
            <div>
              <Submit label="Signup" className={classes.submit} />
            </div>
          </Form>
        </div>
      </div>
    </Gutter>
  )
}
