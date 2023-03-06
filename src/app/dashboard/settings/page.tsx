'use client'

import * as React from 'react'
import { Text } from '@forms/fields/Text'
import Form from '@forms/Form'
import Submit from '@forms/Submit'

import { Gutter } from '@components/Gutter'
import { useAuth } from '@root/providers/Auth'
import { RouteTabs } from '../_components/RouteTabs'

import classes from './page.module.scss'

export default () => {
  const { user } = useAuth()

  if (!user) return null

  return (
    <React.Fragment>
      <RouteTabs
        basePath="/dashboard"
        tabs={[
          {
            label: 'Projects',
          },
          {
            label: 'Teams',
            slug: 'teams',
          },
          {
            label: 'Settings',
            slug: 'settings',
          },
        ]}
      />
      <Gutter>
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
          <Submit label="Save" />
        </Form>
      </Gutter>
    </React.Fragment>
  )
}
