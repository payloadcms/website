'use client'

import React, { useCallback } from 'react'
import { Text } from '@forms/fields/Text'
import Form from '@forms/Form'
import Submit from '@forms/Submit'
import { OnSubmit } from '@forms/types'

import { Button } from '@components/Button'
import { Gutter } from '@components/Gutter'
import { Heading } from '@components/Heading'
import { useAuth } from '@root/providers/Auth'

import classes from './page.module.scss'
export default () => {
  const { user, updateUser } = useAuth()
  const [loading, setLoading] = React.useState<boolean>(false)
  const [error, setError] = React.useState<string | null>(null)
  const [success, setSuccess] = React.useState<string | null>(null)

  const handleSubmit: OnSubmit = useCallback(
    async ({ data, dispatchFields }): Promise<void> => {
      const loadingTimer = setTimeout(() => {
        setLoading(true)
      }, 250)

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

        clearTimeout(loadingTimer)
        setError(null)
        setSuccess('Your account has been updated')
      } catch (err) {
        clearTimeout(loadingTimer)
        const message = err?.message || `An error occurred while attempting to update your account`
        console.error(message) // eslint-disable-line no-console
        setSuccess(null)
        setError(message)
      }

      // @ts-expect-error
      return () => {
        clearTimeout(loadingTimer)
      }
    },
    [updateUser],
  )

  return (
    <Gutter className={classes.content}>
      <Heading marginTop={false} element="h1" as="h6" className={classes.title}>
        Account settings
      </Heading>
      <div className={classes.formState}>
        {loading && <p className={classes.loading}>Loading...</p>}
        {error && <p className={classes.error}>{error}</p>}
        {success && <p className={classes.success}>{success}</p>}
      </div>
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
        <Text path="name" label="Name" />
        <Text path="email" label="Email" required />
        <Text type="password" path="password" label="Password" />
        <Text type="password" path="passwordConfirm" label="Password Confirm" />
        <Submit label="Save" className={classes.submit} />
      </Form>
      <hr className={classes.hr} />
      <Button label="Log out" appearance="secondary" href="/logout" el="link" />
    </Gutter>
  )
}
