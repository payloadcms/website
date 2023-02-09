'use client'

import React, { Fragment, useCallback, useEffect, useState } from 'react'
import { Text } from '@forms/fields/Text'
import Form from '@forms/Form'
import Submit from '@forms/Submit'
import { Data } from '@forms/types'
import Link from 'next/link'
import { redirect } from 'next/navigation'

// import { useGitHubAuthCallback } from '@components/GitHubAuth/useGitHubAuthCallback'
import { Gutter } from '@components/Gutter'
import { Heading } from '@components/Heading'
import { useAuth } from '@root/providers/Auth'

import classes from './index.module.scss'

const Login: React.FC = () => {
  const { user, login } = useAuth()
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  // const { loading: loadingGH, error: errorGH, code } = useGitHubAuthCallback()

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const state = params.get('state')
    const code = params.get('code')
    if (state === 'import') {
      redirect(`/new/import?code=${code}`)
    }
  }, [])

  const handleSubmit = useCallback(
    async (data: Data) => {
      const loadingTimer = setTimeout(() => {
        setLoading(true)
      }, 1000)

      try {
        const loggedInUser = await login({
          email: data.email as string,
          password: data.password as string,
        })

        clearTimeout(loadingTimer)

        if (loggedInUser) {
          redirect('/dashboard')
        } else {
          setLoading(false)
          setError('Invalid email or password')
        }
      } catch (err) {
        clearTimeout(loadingTimer)
        console.error(err)
        setLoading(false)
        setError('Invalid email or password')
      }
    },
    [login],
  )

  if (user) redirect('/dashboard')

  if (user === undefined) return null

  if (loading)
    return (
      <Gutter>
        <div>Logging in...</div>
      </Gutter>
    )

  return (
    <Gutter>
      <Heading marginTop={false}>Log in</Heading>
      {error && <div className={classes.error}>{error}</div>}
      <Fragment>
        <div className={classes.leader}>
          {`Don't have an account? `}
          <Link href="/create-account">Register for free</Link>
          {'.'}
        </div>
        <Form onSubmit={handleSubmit} className={classes.form}>
          <Text path="email" label="Email" required />
          <Text path="password" label="Password" type="password" required />
          <Submit label="Log in" className={classes.submit} />
        </Form>
        <Link href="/recover-password">Forgot your password?</Link>
      </Fragment>
    </Gutter>
  )
}

export default Login
