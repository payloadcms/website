'use client'

import React, { useCallback } from 'react'
import { Cell, Grid } from '@faceless-ui/css-grid'
import { Text } from '@forms/fields/Text'
import Form from '@forms/Form'
import FormProcessing from '@forms/FormProcessing'
import FormSubmissionError from '@forms/FormSubmissionError'
import Submit from '@forms/Submit'
import { InitialState, OnSubmit } from '@forms/types'
import Link from 'next/link'
import { redirect } from 'next/navigation'

import { Gutter } from '@components/Gutter'
import { Heading } from '@components/Heading'
import { Highlight } from '@components/Highlight'
import { RenderParams } from '@root/app/_components/RenderParams'
import { useAuth } from '@root/providers/Auth'
import canUseDom from '@root/utilities/can-use-dom'

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
        <Grid>
          <Cell cols={5} colsM={8}>
            <Heading marginTop={false} element="p" as="h6">
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
          </Cell>
        </Grid>
      </Gutter>
    )
  }

  return (
    <Gutter>
      <RenderParams />
      <Heading marginTop={false} element="h1">
        Forgot password
      </Heading>
      <Grid>
        <Cell cols={5} colsM={8}>
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
        </Cell>
      </Grid>
    </Gutter>
  )
}
