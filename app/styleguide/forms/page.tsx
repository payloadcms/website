import React from 'react'
import { Text } from '@forms/fields/Text'
import { Textarea } from '@forms/fields/Textarea'
import Form from '@forms/Form'
import Submit from '@forms/Submit'
import { StyleguidePageContent } from '../PageContent'

const Forms: React.FC = () => {
  return (
    <StyleguidePageContent title="Forms">
      <Form>
        <Text path="Name" label="Name" />
        <br />
        <Textarea path="message" label="Message" />
        <br />
        <Submit label="Submit" />
      </Form>
    </StyleguidePageContent>
  )
}

export default Forms
