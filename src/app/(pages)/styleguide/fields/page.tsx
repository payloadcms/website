import React from 'react'
import { Checkbox } from '@forms/fields/Checkbox/index.js'
import { NumberInput } from '@forms/fields/Number/index.js'
import RadioGroup from '@forms/fields/RadioGroup/index.js'
import { Select } from '@forms/fields/Select/index.js'
import { Text } from '@forms/fields/Text/index.js'
import { Textarea } from '@forms/fields/Textarea/index.js'
import { Metadata } from 'next'

import { Gutter } from '@components/Gutter/index.js'
import { StyleguidePageContent } from '../PageContent/index.js'

const Fields: React.FC = () => {
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

export default Fields

export const metadata: Metadata = {
  title: 'Fields',
}
