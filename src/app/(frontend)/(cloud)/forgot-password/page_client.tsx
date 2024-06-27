'use client'

import React, { useCallback } from 'react'
import { Text } from '@forms/fields/Text/index.js'
import Form from '@forms/Form/index.js'
import FormProcessing from '@forms/FormProcessing/index.js'
import FormSubmissionError from '@forms/FormSubmissionError/index.js'
import Submit from '@forms/Submit/index.js'
import { InitialState, OnSubmit } from '@forms/types.js'
import Link from 'next/link'

import { redirect } from 'next/navigation'

import { Gutter } from '@components/Gutter/index.js'
import { Heading } from '@components/Heading/index.js'
import { Highlight } from '@components/Highlight/index.js'
import { RenderParams } from '@components/RenderParams/index.js'
import { useAuth } from '@root/providers/Auth/index.js'
import canUseDom from '@root/utilities/can-use-dom.js'

import classes from './page.module.scss'

const initialFormState: InitialState = {
  email: {
    value: '',
    valid: false,
    initialValue: undefined,
    errorMessage: 'Please enter a valid email address',
  },
}

export const ForgotPassword: React.FC = () => {
  const { user } = useAuth()
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

  if (user === undefined) return null

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
        <Heading marginTop={false} element="h2" as="h2">
          <Highlight text="Success" />
        </Heading>
        <div className={['grid'].filter(Boolean).join(' ')}>
          <div className={['cols-6 cols-m-8'].filter(Boolean).join(' ')}>
            <Heading marginTop={false} element="p" as="h4">
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
      <Heading marginTop={false} element="h1">
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
          <Form onSubmit={handleSubmit} className={classes.form} initialState={initialFormState}>
            <FormSubmissionError />
            <FormProcessing message="Sending recovery email, one moment..." />
            <Text path="email" label="Email" required />
            <div>
              <Submit label="Recover" className={classes.submit} />
            </div>
          </Form>
        </div>
      </div>
    </Gutter>
  )
}
