'use client'

import { Button } from '@components/Button'
import { Gutter } from '@components/Gutter'
import { Text } from '@forms/fields/Text'
import Form from '@forms/Form'
import Submit from '@forms/Submit'
import { Data } from '@forms/types'
import { useAuth } from '@root/providers/Auth'
import React, { useCallback } from 'react'

const Login: React.FC = () => {
  const { user, logout, login } = useAuth()

  const handleSubmit = useCallback(
    async (data: Data) => {
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
      <h1>Login</h1>
      <Form onSubmit={handleSubmit}>
        <Text path="email" label="Email" />
        <Text path="password" label="Password" type="password" />
        <Submit label="Login" />
      </Form>
    </Gutter>
  )
}

export default Login
