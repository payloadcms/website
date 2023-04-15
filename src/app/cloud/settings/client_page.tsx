'use client'

import React, { Fragment, useCallback } from 'react'
import { Cell, Grid } from '@faceless-ui/css-grid'
import { Text } from '@forms/fields/Text'
import Form from '@forms/Form'
import FormProcessing from '@forms/FormProcessing'
import FormSubmissionError from '@forms/FormSubmissionError'
import Submit from '@forms/Submit'
import { OnSubmit } from '@forms/types'

import { Button } from '@components/Button'
import { Gutter } from '@components/Gutter'
import { Heading } from '@components/Heading'
import { Message } from '@components/Message'
import { useAuth } from '@root/providers/Auth'

import classes from './page.module.scss'

export const SettingsPage = () => {
  const { user, updateUser } = useAuth()
  const [formToShow, setFormToShow] = React.useState<'account' | 'password'>('account')
  const [success, setSuccess] = React.useState<string | null>(null)

  const handleSubmit: OnSubmit = useCallback(
    async ({ data, dispatchFields }): Promise<void> => {
      setTimeout(() => {
        window.scrollTo(0, 0)
      }, 0)

      if (data?.password && data.password !== data.passwordConfirm) {
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
        await updateUser({
          name: data.name,
          email: data.email,
          password: data.password,
        })

        setSuccess('Your account has been updated')
      } catch (err) {
        const message = err?.message || `An error occurred while attempting to update your account`
        console.error(message) // eslint-disable-line no-console
        setSuccess(null)
        throw new Error(message)
      }
    },
    [updateUser],
  )

  return (
    <Gutter className={classes.content}>
      <Heading marginTop={false} marginBottom={false} element="h1" as="h6">
        Account Settings
      </Heading>
      <div className={classes.formState}>
        <Message success={success} />
      </div>
      <Grid>
        <Cell cols={6} colsM={8}>
          <p>
            {formToShow === 'account' && (
              <Fragment>
                {'To change your password, '}
                <button
                  className={classes.viewButton}
                  type="button"
                  onClick={() => {
                    setFormToShow('password')
                  }}
                >
                  click here
                </button>
                {'.'}
              </Fragment>
            )}
            {formToShow === 'password' && (
              <Fragment>
                {'Change your password below. '}
                <button
                  className={classes.viewButton}
                  type="button"
                  onClick={() => {
                    setFormToShow('account')
                  }}
                >
                  Cancel
                </button>
                {'.'}
              </Fragment>
            )}
          </p>
          <Form
            className={classes.form}
            initialState={{
              name: {
                value: user?.name,
                initialValue: user?.name,
                errorMessage: 'Please enter a name',
              },
              email: {
                value: user?.email,
                valid: Boolean(user?.email),
                initialValue: user?.email,
                errorMessage: 'Please enter a valid email address',
              },
              password: {
                value: '',
                initialValue: undefined,
                errorMessage: 'Please enter a password',
              },
              passwordConfirm: {
                value: '',
                initialValue: undefined,
                errorMessage: 'Please confirm your password',
              },
            }}
            onSubmit={handleSubmit}
          >
            <FormSubmissionError />
            <FormProcessing message="Updating profile, one moment" />
            {formToShow === 'account' && (
              <>
                <Text path="name" label="Your Full Name" />
                <Text path="email" label="Email" required />
                <Text
                  value={user?.id}
                  label="User ID"
                  disabled
                  description="This is your user's ID within Payload"
                />
              </>
            )}
            {formToShow === 'password' && (
              <>
                <Text type="password" path="password" label="Password" />
                <Text type="password" path="passwordConfirm" label="Password Confirm" />
              </>
            )}
            <div className={classes.buttonWrap}>
              {formToShow === 'password' && (
                <Button
                  label="Cancel"
                  appearance="secondary"
                  onClick={() => {
                    setFormToShow('account')
                  }}
                />
              )}
              <Submit label="Save" className={classes.submit} />
            </div>
          </Form>
        </Cell>
      </Grid>
      <hr className={classes.hr} />
      <Button label="Log out" appearance="secondary" href="/logout" el="link" />
    </Gutter>
  )
}
