'use client'

import React, { useCallback } from 'react'
import { Text } from '@forms/fields/Text'
import Form from '@forms/Form'
import Submit from '@forms/Submit'
import Link from 'next/link'

import { Button } from '@components/Button'
import { Gutter } from '@components/Gutter'
import { Heading } from '@components/Heading'
import { useAuth } from '@root/providers/Auth'

import classes from './index.module.scss'

const RecoverPassword: React.FC = () => {
  const { user, logout, login } = useAuth()

  const handleSubmit = useCallback(
    async ({ data }) => {
      await login({
        email: data.email as string,
        password: data.password as string,
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
      <Heading marginTop={false}>Recover password</Heading>
      <div className={classes.leader}>
        {`Already have an account? `}
        <Link href="/login">Log in here</Link>
        {'.'}
      </div>
      <Form onSubmit={handleSubmit} className={classes.form}>
        <Text path="email" label="Email" required />
        <Submit label="Recover Password" className={classes.submit} />
      </Form>
    </Gutter>
  )
}

export default RecoverPassword
