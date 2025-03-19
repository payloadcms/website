'use client'

import type { InitialState, OnSubmit } from '@forms/types'

import { Gutter } from '@components/Gutter/index'
import { Heading } from '@components/Heading/index'
import { Highlight } from '@components/Highlight/index'
import { RenderParams } from '@components/RenderParams/index'
import { Text } from '@forms/fields/Text/index'
import Form from '@forms/Form/index'
import FormProcessing from '@forms/FormProcessing/index'
import FormSubmissionError from '@forms/FormSubmissionError/index'
import Submit from '@forms/Submit/index'
import { useAuth } from '@root/providers/Auth/index'
import canUseDom from '@root/utilities/can-use-dom'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import React, { useCallback } from 'react'

import classes from './page.module.scss'

const initialFormState: InitialState = {
  email: {
    errorMessage: 'Please enter a valid email address',
    initialValue: undefined,
    valid: false,
    value: '',
  },
}

export const ForgotPassword: React.FC = () => {
  const { user } = useAuth()
  const [successfullySubmitted, setSuccessfullySubmitted] = React.useState(false)

  const handleSubmit: OnSubmit = useCallback(
    async ({ data, dispatchFields }) => {
      try {
        const req = await fetch(`${process.env.NEXT_PUBLIC_CLOUD_CMS_URL}/api/graphql`, {
          body: JSON.stringify({
            query: `mutation {
              forgotPasswordUser(email: "${data.email}")
            }`,
          }),
          headers: {
            'Content-Type': 'application/json',
          },
          method: 'POST',
        })

        const res = await req.json()

        dispatchFields({
          type: 'RESET',
          payload: initialFormState,
        })

        setSuccessfullySubmitted(true)
        return
      } catch (err) {
        throw new Error(err.message)
      }
    },
    [setSuccessfullySubmitted],
  )

  if (user === undefined) {
    return null
  }

  if (user) {
    redirect(
      `/cloud/settings?error=${encodeURIComponent(
        'Cannot reset password while logged in. To change your password, you may use your account settings below or log out and try again.',
      )}`,
    )
  }

  if (successfullySubmitted) {
    return (
      <Gutter>
        <Heading as="h2" element="h2" marginTop={false}>
          <Highlight text="Success" />
        </Heading>
        <div className={['grid'].filter(Boolean).join(' ')}>
          <div className={['cols-6 cols-m-8'].filter(Boolean).join(' ')}>
            <Heading as="h4" element="p" marginTop={false}>
              We have sent you an email with a link to reset your password. Please check your inbox.
            </Heading>
            <div className={classes.links}>
              <p>
                {`Ready to login? `}
                <Link href="/login" prefetch={false}>
                  Log in now
                </Link>
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
      <RenderParams />
      <Heading element="h1" marginTop={false}>
        Forgot password
      </Heading>
      <div className={['grid'].filter(Boolean).join(' ')}>
        <div className={['cols-6 cols-m-8'].filter(Boolean).join(' ')}>
          <div className={classes.links}>
            <p>
              {`Know your password? `}
              <Link href={`/login${canUseDom ? window.location.search : ''}`} prefetch={false}>
                Log in here
              </Link>
              {'.'}
            </p>
          </div>
          <Form className={classes.form} initialState={initialFormState} onSubmit={handleSubmit}>
            <FormSubmissionError />
            <FormProcessing message="Sending recovery email, one moment..." />
            <Text label="Email" path="email" required />
            <div>
              <Submit className={classes.submit} label="Recover" />
            </div>
          </Form>
        </div>
      </div>
    </Gutter>
  )
}
