'use client'

import React, { useCallback, useEffect } from 'react'
import { Cell, Grid } from '@faceless-ui/css-grid'
import { Text } from '@forms/fields/Text'
import Form from '@forms/Form'
import FormProcessing from '@forms/FormProcessing'
import FormSubmissionError from '@forms/FormSubmissionError'
import Submit from '@forms/Submit'
import { redirect, useSearchParams } from 'next/navigation'

import { Gutter } from '@components/Gutter'
import { Heading } from '@components/Heading'
import { useAuth } from '@root/providers/Auth'

import classes from './index.module.scss'

export const ResetPassword: React.FC = () => {
  const searchParams = useSearchParams()

  const token = searchParams?.get('token')

  const { user, resetPassword } = useAuth()

  const handleSubmit = useCallback(
    async ({ data }) => {
      try {
        await resetPassword({
          password: data.password as string,
          passwordConfirm: data.passwordConfirm as string,
          token: token as string,
        })
      } catch (e: any) {
        throw new Error(e.message)
      }
    },
    [resetPassword, token],
  )

  if (user) {
    redirect(
      `/cloud/settings?success=${encodeURIComponent(
        `Your password has been reset. You may now log in.`,
      )}`,
    )
  }

  return (
    <Gutter>
      <Heading marginTop={false} element="h1">
        Reset password
      </Heading>
      <Grid>
        <Cell cols={5} colsM={8}>
          <Form
            onSubmit={handleSubmit}
            className={classes.form}
            initialState={{
              password: {
                value: '',
              },
              passwordConfirm: {
                value: '',
              },
              token: {
                value: '',
              },
            }}
          >
            <FormSubmissionError />
            <FormProcessing message="Resetting password, one moment..." />
            <Text path="password" type="password" label="New Password" required />
            <Text path="passwordConfirm" type="password" label="Confirm Password" required />
            <div>
              <Submit label="Reset Password" className={classes.submit} />
            </div>
          </Form>
        </Cell>
      </Grid>
    </Gutter>
  )
}
