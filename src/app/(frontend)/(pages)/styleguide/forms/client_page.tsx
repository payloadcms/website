'use client'

import { Gutter } from '@components/Gutter/index'
import { Text } from '@forms/fields/Text/index'
import { Textarea } from '@forms/fields/Textarea/index'
import Form from '@forms/Form/index'
import Submit from '@forms/Submit/index'
import React from 'react'

import { StyleguidePageContent } from '../PageContent/index'

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
          onSubmit={(args) => {
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
