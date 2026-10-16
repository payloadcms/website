'use client'

import type { Option } from '@payloadcms/ui/elements/ReactSelect'

import { ReactSelect } from '@payloadcms/ui/elements/ReactSelect'
import { CheckboxInput } from '@payloadcms/ui/fields/Checkbox'
import { FieldDescription } from '@payloadcms/ui/fields/FieldDescription'
import { FieldLabel } from '@payloadcms/ui/fields/FieldLabel'
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
  const [value, setValue] = useState<Option<string>>(options[1])

  return (
    <div className="field-type select" data-size="large">
      <FieldLabel htmlFor="status" label="Status" />
      <div className="field-type__wrap">
        <ReactSelect
          aria-label="Status"
          inputId="status"
          menuPortalTarget={null}
          onChange={(option) => setValue(option as Option<string>)}
          options={options}
          value={value}
        />
      </div>
      <FieldDescription
        description="Controls where the project appears in the workflow."
        path="status"
      />
    </div>
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
