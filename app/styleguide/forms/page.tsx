'use client'

import React from 'react'
import { Text } from '@forms/fields/Text'
import { Textarea } from '@forms/fields/Textarea'
import Form from '@forms/Form'
import Submit from '@forms/Submit'
import { StyleguidePageContent } from '../PageContent'

const Forms: React.FC = () => {
  return (
    <StyleguidePageContent title="Forms">
      <Form
        onSubmit={args => {
          console.log(args)
        }}
        initialState={{
          name: {
            initialValue: 'Bob',
          },
        }}
      >
        <Text path="name" label="Name" placeholder="John" required />
        <br />
        <Textarea path="message" label="Message" placeholder="Message" />
        <br />
        <Submit label="Submit" />
      </Form>
    </StyleguidePageContent>
  )
}

export default Forms
