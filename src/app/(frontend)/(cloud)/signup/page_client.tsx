'use client'

import type { InitialState, OnSubmit } from '@forms/types'

import { Button } from '@components/Button/index'
import { Gutter } from '@components/Gutter/index'
import { Heading } from '@components/Heading/index'
import { Highlight } from '@components/Highlight/index'
import { Text } from '@forms/fields/Text/index'
import Form from '@forms/Form/index'
import FormProcessing from '@forms/FormProcessing/index'
import FormSubmissionError from '@forms/FormSubmissionError/index'
import Submit from '@forms/Submit/index'
import { useAuth } from '@root/providers/Auth/index'
import canUseDom from '@root/utilities/can-use-dom'
import { getCookie } from '@root/utilities/get-cookie'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import React, { useCallback, useState } from 'react'

import classes from './page.module.scss'

const initialFormState: InitialState = {
  email: {
    errorMessage: 'Please enter a valid email address',
    initialValue: undefined,
    valid: false,
    value: '',
  },
  password: {
    errorMessage: 'Please enter a password',
    initialValue: undefined,
    valid: false,
    value: '',
  },
  passwordConfirm: {
    errorMessage: 'Please confirm your password',
    initialValue: undefined,
    valid: false,
    value: '',
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
            errorMessage: 'Passwords do not match',
            path: 'passwordConfirm',
            valid: false,
            value: formData.passwordConfirm,
          },
          {
            errorMessage: 'Passwords do not match',
            path: 'password',
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
          body: JSON.stringify({
            hubspotCookie,
            pageName,
            pageUri,
            query: `mutation {
            createUser(data: { email: "${formData.email}", password: "${formData.password}"}) {
              email
            }
          }`,
          }),
          headers: {
            'Content-Type': 'application/json',
          },
          method: 'POST',
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
        <div className="grid">
          <div className="cols-5 cols-m-8">
            <h2>Already logged in</h2>
            <p>You must first logout to create another account.</p>
            <div className={classes.buttonWrap}>
              <Button appearance="primary" el="link" href="/logout" label="Log out" />
              <Button appearance="secondary" el="link" href="/cloud" label="Dashboard" />
            </div>
          </div>
        </div>
      </Gutter>
    )
  }

  if (successfullySubmitted) {
    return (
      <Gutter>
        <h2 id="cloud-registered-successfully">Verify your account</h2>
        <div className="grid">
          <div className="cols-5 cols-m-8">
            <p>
              Your account has been created. Please check your email to verify your account and
              login.
            </p>
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
      <h1 className={classes.heading}>Create an account</h1>
      <div className="grid">
        <div className="cols-5 cols-m-8">
          <div className={classes.links}>
            {`Already have an account? `}
            <Link href={`/login${redirectParam ? `?redirect=${redirectParam}` : ''}`}>
              Log in now
            </Link>
            {'.'}
          </div>
          <Form
            className={classes.form}
            formId={'payload_cloud_sign_up'}
            initialState={initialFormState}
            onSubmit={createAccount}
          >
            <FormSubmissionError />
            <FormProcessing message="Signing up, one moment..." />
            <Text
              initialValue={searchParams?.get('email') || undefined}
              label="Email"
              path="email"
              required
            />
            <Text label="Password" path="password" required type="password" />
            <Text label="Confirm Password" path="passwordConfirm" required type="password" />
            {typeof redirectParam === 'string' && (
              <Text path="redirect" type="hidden" value={redirectParam} />
            )}
            <div>
              <Submit className={classes.submit} label="Signup" />
            </div>
          </Form>
        </div>
      </div>
    </Gutter>
  )
}
