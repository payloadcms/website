'use client'

import type { InitialState } from '@forms/types'

import { cloudSlug } from '@cloud/slug'
import { Banner } from '@components/Banner'
import { Gutter } from '@components/Gutter/index'
import { RenderParams } from '@components/RenderParams/index'
import { Text } from '@forms/fields/Text/index'
import Form from '@forms/Form/index'
import FormProcessing from '@forms/FormProcessing/index'
import FormSubmissionError from '@forms/FormSubmissionError/index'
import Submit from '@forms/Submit/index'
import { ArrowIcon } from '@icons/ArrowIcon'
import { useAuth } from '@root/providers/Auth/index'
import Link from 'next/link'
import { redirect, useSearchParams } from 'next/navigation'
import React, { useCallback, useEffect, useState } from 'react'

import classes from './page.module.scss'

const initialFormState: InitialState = {
  email: {
    errorMessage: 'Please enter a valid email address',
    initialValue: '',
    valid: false,
    value: '',
  },
  password: {
    errorMessage: 'Please enter a password',
    initialValue: '',
    valid: false,
    value: '',
  },
}

export const Login: React.FC = () => {
  const searchParams = useSearchParams()
  const { login, user } = useAuth()
  const [redirectTo, setRedirectTo] = useState(cloudSlug)

  useEffect(() => {
    const trustedRoutes = ['/'] // .. add more routes or external links

    const redirectParam = searchParams?.get('redirect')
    if (redirectParam) {
      // Check if the provided 'redirectParam' is among the trusted routes
      const isTrustedRoute = trustedRoutes.includes(redirectParam)

      // If the 'redirectParam' is trusted, update the redirection target
      if (isTrustedRoute) {
        setRedirectTo(redirectParam)
      }

      // If the 'redirectParam' is not trusted, redirect to the default 'cloudSlug'
      else {
        setRedirectTo(cloudSlug)
      }
    }
  }, [searchParams])

  const handleSubmit = useCallback(
    async ({ data }) => {
      setTimeout(() => {
        window.scrollTo(0, 0)
      }, 0)

      try {
        const loggedInUser = await login({
          email: data.email as string,
          password: data.password as string,
        })

        if (!loggedInUser) {
          throw new Error(`Invalid email or password`)
        }
      } catch (err) {
        console.error(err) // eslint-disable-line no-console
        throw new Error(`Invalid email or password`)
      }
    },
    [login],
  )

  if (user === undefined) {
    return null
  }

  if (user) {
    redirect(redirectTo)
  }

  return (
    <Gutter>
      <RenderParams />
      <h1 className={classes.heading}>Log in to Payload Cloud</h1>
      <Banner type="success">
        We're joining Figma! During this transition, new signups are paused. Existing projects
        continue running normally.&nbsp;&nbsp;
        <Link href="/payload-has-joined-figma">Read more</Link>
        &nbsp;&nbsp;
        <ArrowIcon />
      </Banner>
      <div className="grid">
        <div className={['cols-6 cols-m-8'].filter(Boolean).join(' ')}>
          <Form className={classes.form} initialState={initialFormState} onSubmit={handleSubmit}>
            <FormSubmissionError />
            <FormProcessing message="Logging in, one moment..." />
            <Text
              elementAttributes={{ autoComplete: 'on' }}
              initialValue={searchParams?.get('email') || undefined}
              label="Email"
              path="email"
              required
            />
            <Text label="Password" path="password" required type="password" />
            <div>
              <Submit className={classes.submit} label="Log in" />
            </div>
            <p>
              {`Forgot your password? `}
              <Link href={`/forgot-password${redirectTo ? `?redirect=${redirectTo}` : ''}`}>
                Reset it here
              </Link>
              {'.'}
            </p>
          </Form>
        </div>
      </div>
    </Gutter>
  )
}
