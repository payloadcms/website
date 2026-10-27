'use client'

import type { Option } from '@payloadcms/ui/elements/ReactSelect'

import { ReactSelect } from '@payloadcms/ui/elements/ReactSelect'
import { FieldLabel } from '@payloadcms/ui/fields/FieldLabel'
import { UploadInput } from '@payloadcms/ui/fields/Upload'
import { useState } from 'react'

import type { ComponentRenders } from './types'

import classes from '../examples.module.scss'
import { FieldPreviewProviders, RelationshipPreviewProviders } from './FieldPreviewProviders'

const relationshipOptions = [
  {
    label: 'Posts',
    options: [
      { label: 'Example post one', value: 'post-one' },
      { label: 'Example post two', value: 'post-two' },
      { label: 'Example post three', value: 'post-three' },
    ],
  },
]

const RelationshipInputDemo = () => {
  const [value, setValue] = useState<Option<string>[]>([])

  return (
    <div className="field-type relationship" data-size="large">
      <FieldLabel htmlFor="related-posts" label="Related posts" />
      <div className="field-type__wrap">
        <ReactSelect
          aria-label="Related posts"
          inputId="related-posts"
          isMulti
          menuPortalTarget={null}
          onChange={(options) => setValue(options as Option<string>[])}
          options={relationshipOptions}
          placeholder="Choose posts"
          value={value}
        />
      </div>
    </div>
  )
}

const UploadInputDemo = () => {
  const [value, setValue] = useState<number | string>()

  return (
    <UploadInput
      allowCreate
      label="Media"
      onChange={setValue}
      path="media"
      relationTo="media"
      required
      value={value}
    />
  )
}

export const relationshipInputsExamples: ComponentRenders = {
  relationship: {
    render: () => (
      <FieldPreviewProviders>
        <div className={classes.relationshipFieldPreview}>
          <RelationshipInputDemo />
        </div>
      </FieldPreviewProviders>
    ),
  },
  upload: {
    render: () => (
      <RelationshipPreviewProviders>
        <div className={classes.contextualFieldPreview} data-component-preview-size="compact">
          <UploadInputDemo />
        </div>
      </RelationshipPreviewProviders>
    ),
  },
}
