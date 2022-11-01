import React from 'react'
import { Select } from '@forms/fields/Select'
import { Text } from '@forms/fields/Text'
import { Textarea } from '@forms/fields/Textarea'
import { StyleguidePageContent } from '../PageContent'

const Forms: React.FC = () => {
  return (
    <StyleguidePageContent title="Fields">
      <Text placeholder="John" label="Text Field" />
      <br />
      <Select
        label="Select Field"
        options={[
          {
            label: 'None',
            value: '',
          },
          {
            label: 'Option 1',
            value: 'option1',
          },
          {
            label: 'Option 2',
            value: 'option2',
          },
        ]}
      />
      <br />
      <Textarea label="Textarea Field" />
    </StyleguidePageContent>
  )
}

export default Forms
