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

const CreateAccount: React.FC = () => {
  const { setHeaderColor } = useHeaderTheme()

  useEffect(() => {
    const implicitPreference = getImplicitPreference()
    setHeaderColor(implicitPreference ?? 'light')
  }, [])

  const { user, logout, login, create } = useAuth()

  const handleSubmit = useCallback(
    async (data: Data) => {
      await create({
        email: data.email as string,
        password: data.password as string,
        passwordConfirm: data.passwordConfirm as string,
      })
    },
    [login],
  )

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
      <h1>Create an account</h1>
      <div className={classes.leader}>
        {`Already have an account? `}
        <Link href="/login">Log in now</Link>
        {'.'}
      </div>
      <Form onSubmit={handleSubmit} className={classes.form}>
        <Text path="email" label="Email" />
        <Text path="password" label="Password" type="password" required />
        <Text path="passwordConfirm" label="Confirm Password" type="password" required />
        <Submit label="Create Account" className={classes.submit} />
      </Form>
    </Gutter>
  )
}

export default CreateAccount
