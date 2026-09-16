'use client'

import type { ValueWithRelation } from 'payload'

import { RelationshipInput } from '@payloadcms/ui/fields/Relationship'
import { UploadInput } from '@payloadcms/ui/fields/Upload'
import { useState } from 'react'

import type { ComponentRenders } from './types'

import classes from '../examples.module.scss'
import { RelationshipPreviewProviders } from './FieldPreviewProviders'

const RelationshipInputDemo = () => {
  const [value, setValue] = useState<ValueWithRelation[]>([])

  return (
    <RelationshipInput
      allowCreate={false}
      appearance="select"
      hasMany
      label="Related posts"
      onChange={setValue}
      path="relatedPosts"
      placeholder="Choose posts"
      relationTo={['posts']}
      value={value}
    />
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
      <RelationshipPreviewProviders>
        <div className={classes.relationshipFieldPreview}>
          <RelationshipInputDemo />
        </div>
      </RelationshipPreviewProviders>
    ),
  },
  upload: {
    render: () => (
      <RelationshipPreviewProviders>
        <div className={classes.contextualFieldPreview}>
          <UploadInputDemo />
        </div>
      </RelationshipPreviewProviders>
    ),
  },
}
