'use client'

import React from 'react'
import { Text } from '@forms/fields/Text/index.js'
import { Textarea } from '@forms/fields/Textarea/index.js'
import Form from '@forms/Form/index.js'
import Submit from '@forms/Submit/index.js'

import { Gutter } from '@components/Gutter/index.js'
import { StyleguidePageContent } from '../PageContent/index.js'

export const FormsExample: React.FC = () => {
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
