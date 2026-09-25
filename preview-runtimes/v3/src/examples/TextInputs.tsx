'use client'

import { TextInput } from '@payloadcms/ui/fields/Text'
import { TextareaInput } from '@payloadcms/ui/fields/Textarea'
import { useState } from 'react'

import type { ComponentRenders } from './types'

import classes from '../examples.module.scss'
import { FieldPreviewProviders } from './FieldPreviewProviders'

const TextInputDemo = () => {
  const [value, setValue] = useState('Quarterly report')

  return (
    <TextInput
      description="Displayed as the document title."
      label="Title"
      onChange={(event) => setValue(event.target.value)}
      path="title"
      required
      value={value}
    />
  )
}

const TextareaInputDemo = () => {
  const [value, setValue] = useState('A concise summary for the project dashboard.')

  return (
    <TextareaInput
      description="Keep the summary brief and useful."
      label="Summary"
      onChange={(event) => setValue(event.target.value)}
      path="summary"
      rows={4}
      value={value}
    />
  )
}

export const textInputsExamples: ComponentRenders = {
  text: {
    render: () => (
      <FieldPreviewProviders>
        <div className={classes.fieldInputPreview}>
          <TextInputDemo />
        </div>
      </FieldPreviewProviders>
    ),
  },
  textarea: {
    render: () => (
      <FieldPreviewProviders>
        <div className={classes.fieldInputPreview}>
          <TextareaInputDemo />
        </div>
      </FieldPreviewProviders>
    ),
  },
}
