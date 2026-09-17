'use client'

import type { ValueWithRelation } from 'payload'

import { RelationshipInput } from '@payloadcms/ui/fields/Relationship'
import { UploadInput } from '@payloadcms/ui/fields/Upload'
import { useEffect, useState } from 'react'

import type { ComponentRenders } from './types'

import classes from '../examples.module.scss'
import { RelationshipPreviewProviders } from './FieldPreviewProviders'

const examplePosts = [
  { id: 'example-post-one', title: 'Example post one' },
  { id: 'example-post-two', title: 'Example post two' },
  { id: 'example-post-three', title: 'Example post three' },
]

const RelationshipInputDemo = () => {
  const [isMockReady, setIsMockReady] = useState(false)
  const [value, setValue] = useState<ValueWithRelation[]>([])

  useEffect(() => {
    const originalFetch = window.fetch

    window.fetch = async (...args) => {
      const [input] = args
      const requestURL =
        typeof input === 'string' ? input : input instanceof URL ? input.href : input.url

      if (new URL(requestURL, window.location.origin).pathname === '/api/posts') {
        return new Response(
          JSON.stringify({
            docs: examplePosts,
            hasNextPage: false,
            nextPage: null,
            page: 1,
            totalDocs: examplePosts.length,
            totalPages: 1,
          }),
          {
            headers: { 'Content-Type': 'application/json' },
            status: 200,
          },
        )
      }

      return originalFetch(...args)
    }

    setIsMockReady(true)

    return () => {
      window.fetch = originalFetch
    }
  }, [])

  if (!isMockReady) {
    return null
  }

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
        <div className={classes.contextualFieldPreview} data-component-preview-size="compact">
          <UploadInputDemo />
        </div>
      </RelationshipPreviewProviders>
    ),
  },
}
