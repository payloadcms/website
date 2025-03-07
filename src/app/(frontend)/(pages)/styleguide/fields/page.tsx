import type { Metadata } from 'next'

import { Gutter } from '@components/Gutter/index'
import { Checkbox } from '@forms/fields/Checkbox/index'
import { NumberInput } from '@forms/fields/Number/index'
import RadioGroup from '@forms/fields/RadioGroup/index'
import { Select } from '@forms/fields/Select/index'
import { Text } from '@forms/fields/Text/index'
import { Textarea } from '@forms/fields/Textarea/index'
import React from 'react'

import { StyleguidePageContent } from '../PageContent/index'

const Fields: React.FC = () => {
  return (
    <StyleguidePageContent darkModeMargins darkModePadding title="Fields">
      <Gutter>
        <Text label="Text Field" placeholder="John" />
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
          isMulti
          label="Multi-select Field"
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
