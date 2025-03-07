'use client'

import { Gutter } from '@components/Gutter/index'
import { Heading } from '@components/Heading/index'
import { Text } from '@forms/fields/Text/index'
import Form from '@forms/Form/index'
import FormProcessing from '@forms/FormProcessing/index'
import FormSubmissionError from '@forms/FormSubmissionError/index'
import Submit from '@forms/Submit/index'
import { useAuth } from '@root/providers/Auth/index'
import { redirect, useSearchParams } from 'next/navigation'
import React, { useCallback } from 'react'

import classes from './page.module.scss'

export const ResetPassword: React.FC = () => {
  const searchParams = useSearchParams()

  const token = searchParams?.get('token')

  const { resetPassword, user } = useAuth()

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

  if (!token) {
    redirect(`/forgot-password?error=${encodeURIComponent('Missing token')}`)
  }

  return (
    <Gutter>
      <h2>Reset password</h2>
      <div className={['grid'].filter(Boolean).join(' ')}>
        <div className={['cols-5 cols-m-8'].filter(Boolean).join(' ')}>
          <Form
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
            onSubmit={handleSubmit}
          >
            <FormSubmissionError />
            <FormProcessing message="Resetting password, one moment..." />
            <Text label="New Password" path="password" required type="password" />
            <Text label="Confirm Password" path="passwordConfirm" required type="password" />
            <div>
              <Submit className={classes.submit} label="Reset Password" />
            </div>
          </Form>
        </div>
      </div>
    </Gutter>
  )
}
