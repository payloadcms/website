'use client'

import React, { useCallback, useState } from 'react'
import { Text } from '@forms/fields/Text'
import Form from '@forms/Form'
import Submit from '@forms/Submit'
import { Data } from '@forms/types'
import Link from 'next/link'

import { Button } from '@components/Button'
import { Gutter } from '@components/Gutter'
import { Heading } from '@components/Heading'
import { useAuth } from '@root/providers/Auth'

import classes from './index.module.scss'

const CreateAccount: React.FC = () => {
  const { user, logout, login, create } = useAuth()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = useCallback(
    async (data: Data) => {
      const loadingTimer = setTimeout(() => {
        setLoading(true)
      }, 1000)

      try {
        await create({
          email: data.email as string,
          password: data.password as string,
          passwordConfirm: data.passwordConfirm as string,
        })

        clearTimeout(loadingTimer)
        setLoading(false)
      } catch (err) {
        console.error(err)
        clearTimeout(loadingTimer)
        setLoading(false)
        setError(err.message)
      }
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
      <Heading marginTop={false}>Create an account</Heading>
      <div className={classes.leader}>
        {`Already have an account? `}
        <Link href="/login">Log in now</Link>
        {'.'}
      </div>
      {error && <div className={classes.error}>{error}</div>}
      {loading && <div className={classes.loading}>Loading...</div>}
      <Form onSubmit={handleSubmit} className={classes.form}>
        <Text path="email" label="Email" required />
        <Text path="password" label="Password" type="password" required />
        <Text path="passwordConfirm" label="Confirm Password" type="password" required />
        <Submit label="Create Account" className={classes.submit} />
      </Form>
    </Gutter>
  )
}

export default CreateAccount
