'use client'

import type { Option } from '@payloadcms/ui/elements/ReactSelect'

import { CheckboxInput } from '@payloadcms/ui/fields/Checkbox'
import { SelectInput } from '@payloadcms/ui/fields/Select'
import { useState } from 'react'

import type { ComponentRenders } from './types'

import classes from '../examples.module.scss'
import { FieldPreviewProviders } from './FieldPreviewProviders'

const options = [
  { label: 'Planned', value: 'planned' },
  { label: 'In progress', value: 'in-progress' },
  { label: 'Complete', value: 'complete' },
]

const CheckboxInputDemo = () => {
  const [checked, setChecked] = useState(true)

  return (
    <CheckboxInput
      checked={checked}
      label="Feature this project"
      name="featured"
      onToggle={(event) => setChecked(event.target.checked)}
    />
  )
}

const SelectInputDemo = () => {
  const [value, setValue] = useState('in-progress')

  return (
    <SelectInput
      description="Controls where the project appears in the workflow."
      label="Status"
      name="status"
      onChange={(option) => setValue((option as null | Option<string>)?.value || '')}
      options={options}
      path="status"
      value={value}
    />
  )
}

export const choiceInputsExamples: ComponentRenders = {
  checkbox: {
    render: () => (
      <FieldPreviewProviders>
        <div className={classes.fieldInputPreview}>
          <CheckboxInputDemo />
        </div>
      </FieldPreviewProviders>
    ),
  },
  select: {
    render: () => (
      <FieldPreviewProviders>
        <div className={classes.fieldInputPreview}>
          <SelectInputDemo />
        </div>
      </FieldPreviewProviders>
    ),
  },
}
