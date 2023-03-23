'use client'

import * as React from 'react'

import { Button } from '@components/Button'
import { Gutter } from '@components/Gutter'
import { Heading } from '@components/Heading'
import { Text } from '@forms/fields/Text'
import Form from '@forms/Form'
import Submit from '@forms/Submit'
import { useAuth } from '@root/providers/Auth'

import classes from './page.module.scss'

export default () => {
  const { user } = useAuth()

  if (!user) return null

  return (
    <Gutter className={classes.content}>
      <Heading element="h1" as="h6" className={classes.title}>
        Account settings
      </Heading>
      <Form
        className={classes.form}
        initialState={{
          name: {
            initialValue: user?.name,
            value: user?.name,
          },
          email: {
            initialValue: user?.email,
            value: user?.email,
          },
        }}
      >
        <Text path="name" label="Name" initialValue={user?.name} />
        <Text path="email" label="Email" initialValue={user?.email} required />
        <Submit label="Save" className={classes.submit} />
      </Form>
      <hr className={classes.hr} />
      <Button label="Log out" appearance="secondary" href="/logout" el="link" />
    </Gutter>
  )
}
