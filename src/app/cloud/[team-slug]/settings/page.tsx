'use client'

import * as React from 'react'
import { Text } from '@forms/fields/Text'
import Form from '@forms/Form'
import Submit from '@forms/Submit'

import { Gutter } from '@components/Gutter'
import { Heading } from '@components/Heading'
import { useRouteData } from '../../context'

import classes from './page.module.scss'

export default () => {
  const { team } = useRouteData()

  return (
    <Gutter className={classes.settings}>
      <Heading marginTop={false} element="h1" as="h6" className={classes.title}>
        Team settings
      </Heading>
      <Form
        className={classes.form}
        initialState={{
          name: {
            initialValue: team?.name,
            value: team?.name,
          },
          slug: {
            initialValue: team?.slug,
            value: team?.slug,
          },
          billingEmail: {
            initialValue: team?.billingEmail,
            value: team?.billingEmail,
          },
        }}
      >
        <Text path="name" label="Name" initialValue={team?.name} />
        <Text path="slug" label="Slug" initialValue={team?.slug} required />
        <Text path="email" label="Billing Email" initialValue={team?.billingEmail} required />
        <Submit label="Save" className={classes.submit} />
      </Form>
    </Gutter>
  )
}
