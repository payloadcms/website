import React from 'react'
import { Text } from '@forms/fields/Text'
import { Textarea } from '@forms/fields/Textarea'
import { StyleguidePageContent } from '../PageContent'

const Forms: React.FC = () => {
  return (
    <StyleguidePageContent title="Fields">
      <Text label="Text Field" />
      <br />
      <Textarea label="Textarea Field" />
    </StyleguidePageContent>
  )
}

export default Forms
