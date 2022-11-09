'use client'

import React from 'react'
import { Text } from '@forms/fields/Text'
import { Textarea } from '@forms/fields/Textarea'
import Form from '@forms/Form'
import Submit from '@forms/Submit'
import { Gutter } from '@components/Gutter'
import { StyleguidePageContent } from '../PageContent'

const Forms: React.FC = () => {
  return (
    <StyleguidePageContent title="Forms" darkModePadding darkModeMargins>
      <Gutter>
        <Form
          onSubmit={args => {
            console.log(args) // eslint-disable-line no-console
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
      </Gutter>
    </StyleguidePageContent>
  )
}

export default Forms
