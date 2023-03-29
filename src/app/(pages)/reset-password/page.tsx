'use client'

import React, { useCallback, useEffect } from 'react'
import { Text } from '@forms/fields/Text'
import Form from '@forms/Form'
import Submit from '@forms/Submit'
import Link from 'next/link'
import { redirect, useSearchParams } from 'next/navigation'

import { Button } from '@components/Button'
import { Gutter } from '@components/Gutter'
import { Heading } from '@components/Heading'
import { BorderBox } from '@root/app/_components/BorderBox'
import { MaxWidth } from '@root/app/_components/MaxWidth'
import { useAuth } from '@root/providers/Auth'
import { useHeaderTheme } from '@root/providers/HeaderTheme'
import { getImplicitPreference } from '@root/providers/Theme/shared'

import classes from './index.module.scss'
import { FormWrap } from '@root/app/_components/FormWrap'

const ResetPassword: React.FC = () => {
  const searchParams = useSearchParams()

  const token = searchParams?.get('token')

  const { user, logout, resetPassword } = useAuth()
  const { setHeaderColor } = useHeaderTheme()
  const [error, setError] = React.useState<string | null>(null)

  useEffect(() => {
    const implicitPreference = getImplicitPreference()
    setHeaderColor(implicitPreference ?? 'light')
  }, [setHeaderColor])

  const handleSubmit = useCallback(
    async ({ data }) => {
      try {
        await resetPassword({
          password: data.password as string,
          passwordConfirm: data.passwordConfirm as string,
          token: token as string,
        })
      } catch (e: any) {
        setError(e.message)
      }
    },
    [resetPassword, token],
  )

  if (user) {
    redirect(`/cloud/settings?message=${encodeURIComponent(`You're password has been reset!`)}`)
  }

  return (
    <Gutter>
      <MaxWidth centered className={classes.maxWidth}>
        <Heading marginTop={false} element="h1" as="h3">
          Reset password
        </Heading>
        <FormWrap>
          {error && <div className={classes.error}>{error}</div>}
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
            <Text path="password" type="password" label="New Password" required />
            <Text path="passwordConfirm" type="password" label="Confirm Password" required />
            <div>
              <Submit label="Reset Password" className={classes.submit} />
            </div>
          </Form>
          <div>
            {`Already have an account? `}
            <Link href="/login">Log in here</Link>.
          </div>
        </FormWrap>
      </MaxWidth>
    </Gutter>
  )
}

export default ResetPassword
