'use client'

import { Button } from '@components/Button'
import { Gutter } from '@components/Gutter'
import { Text } from '@forms/fields/Text'
import Form from '@forms/Form'
import Submit from '@forms/Submit'
import { Data } from '@forms/types'
import { useAuth } from '@root/providers/Auth'
import { useHeaderTheme } from '@root/providers/HeaderTheme'
import { getImplicitPreference } from '@root/providers/Theme/shared'
import Link from 'next/link'
import React, { useCallback, useEffect } from 'react'

import classes from './index.module.scss'

const ResetPassword: React.FC = () => {
  const { user, logout, resetPassword } = useAuth()
  const { setHeaderColor } = useHeaderTheme()

  useEffect(() => {
    const implicitPreference = getImplicitPreference()
    setHeaderColor(implicitPreference ?? 'light')
  }, [])

  const handleSubmit = useCallback(async (data: Data) => {
    await resetPassword({
      password: data.password as string,
      passwordConfirm: data.passwordConfirm as string,
      token: data.token as string,
    })
  }, [])

  if (user) {
    return (
      <Gutter>
        <h1>You are already logged in.</h1>
        <Button label="Log out" onClick={logout} appearance="primary" />
      </Gutter>
    )
  }

  return (
    <Gutter>
      <h1>Reset Password</h1>
      <div className={classes.leader}>
        {`Already have an account? `}
        <Link href="/login">Log in here</Link>
        {'.'}
      </div>
      <Form onSubmit={handleSubmit} className={classes.form}>
        <Text path="password" type="password" label="New Password" required />
        <Text path="passwordConfirm" type="password" label="Confirm Password" required />
        <input type="hidden" name="token" value="TOKEN_HERE" />
        <Submit label="Reset Password" className={classes.submit} />
      </Form>
    </Gutter>
  )
}

export default ResetPassword
