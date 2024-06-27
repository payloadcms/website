'use client'

import React, { useCallback, useState } from 'react'
import { Text } from '@forms/fields/Text/index.js'
import Form from '@forms/Form/index.js'
import FormProcessing from '@forms/FormProcessing/index.js'
import FormSubmissionError from '@forms/FormSubmissionError/index.js'
import Submit from '@forms/Submit/index.js'
import { InitialState, OnSubmit } from '@forms/types.js'
import Link from 'next/link'

import { useSearchParams } from 'next/navigation'

import { Button } from '@components/Button/index.js'
import { Gutter } from '@components/Gutter/index.js'
import { Heading } from '@components/Heading/index.js'
import { Highlight } from '@components/Highlight/index.js'
import { useAuth } from '@root/providers/Auth/index.js'
import canUseDom from '@root/utilities/can-use-dom.js'
import { getCookie } from '@root/utilities/get-cookie.js'

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
        <div className="grid">
          <div className="cols-5 cols-m-8">
            <h2>Already logged in</h2>
            <p>You must first logout to create another account.</p>
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
