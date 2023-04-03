import React from 'react'
import { Checkbox } from '@forms/fields/Checkbox'
import { NumberInput } from '@forms/fields/Number'
import { Phone } from '@forms/fields/Phone'
import RadioGroup from '@forms/fields/RadioGroup'
import { Select } from '@forms/fields/Select'
import { Text } from '@forms/fields/Text'
import { Textarea } from '@forms/fields/Textarea'

import { Gutter } from '@components/Gutter'
import { StyleguidePageContent } from '../PageContent'

const Forms: React.FC = () => {
  return (
    <StyleguidePageContent title="Fields" darkModePadding darkModeMargins>
      <Gutter>
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
        <Select
          label="Multi-select Field"
          isMulti
          options={[
            {
              label: 'Option 1',
              value: 'option1',
            },
            {
              label: 'Option 2',
              value: 'option2',
            },
            {
              label: 'Option 3',
              value: 'option3',
            },
          ]}
        />
        <br />
        <Textarea label="Textarea Field" placeholder="Message" />
        <br />
        <Phone label="Phone Field" placeholder="555-555-5555" />
        <br />
        <NumberInput label="Number Field" placeholder="1234" />
        <br />
        <Checkbox label="Checkbox Field" />
        <br />
        <RadioGroup
          label="Radio Group"
          options={[
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
      </Gutter>
    </StyleguidePageContent>
  )
}

export default Forms
