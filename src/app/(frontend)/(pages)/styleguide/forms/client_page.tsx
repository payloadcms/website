'use client'

import { Gutter } from '@components/Gutter/index.js'
import { Text } from '@forms/fields/Text/index.js'
import { Textarea } from '@forms/fields/Textarea/index.js'
import Form from '@forms/Form/index.js'
import Submit from '@forms/Submit/index.js'
import React from 'react'

import { StyleguidePageContent } from '../PageContent/index.js'

export const FormsExample: React.FC = () => {
  return (
    <StyleguidePageContent darkModeMargins darkModePadding title="Forms">
      <Gutter>
        <Form
          initialState={{
            name: {
              initialValue: 'Bob',
            },
          }}
          onSubmit={args => {
            console.log(args) // eslint-disable-line no-console
          }}
        >
          <Text label="Name" path="name" placeholder="John" required />
          <br />
          <Textarea label="Message" path="message" placeholder="Message" />
          <br />
          <Submit label="Submit" />
        </Form>
      </Gutter>
    </StyleguidePageContent>
  )
}
